const cheerio = require('cheerio');

const youtube_url = "https://www.youtube.com/watch?v=";
const api_url = "https://noembed.com/embed?dataType=json&url=";

// const getParseMarkersList = async (vid) => {
//     return new Promise((resolve, reject) => {
//         exec("./fetch " + vid, (error, stdout, stderr)=>{
//             if (error) reject(error);
//             if (stderr) reject(stderr);
//             resolve(stdout);
//         })
//     })
// }
//
// const parseMarkersList = async (vid) => {
//     try {
//         const res = await getParseMarkersList(vid);
//         return JSON.parse('{' + res + '}');
//     } catch (err) {
//         console.error(err);
//         return {};
//     }
// }

const parseMarkersList = async (dom) => {
    // 1. 모든 <script> 태그의 내용을 확인
    const scripts = dom('script');

    // 주로 뒷 부분에 전역 객채가 있으므로 뒷부분부터 확인인
    for (let i = scripts.length - 1; i >=0; i--) {
        const script = scripts[i];
        const content = dom(script).html() || '';

        // 2. "ytInitialPlayerResponse"라는 전역 변수가
        //    JavaScript 객체 형태로 대입되는 구문을 정규식으로 찾는다.
        //    예:  var ytInitialPlayerResponse = { ... };
        //         window['ytInitialPlayerResponse'] = { ... };
        //    실제로는 변수명 앞뒤로 세미콜론 등 다른 요소들이 있을 수 있으니
        //    필요에 따라 정규식을 조정해야 함.
        //
        //  /ytInitialPlayerResponse\s*=\s*(\{.*?\});/s
        //    - s 플래그(dotAll)로 개행 포함 매칭
        //    - (.*?)는 "가장 적게" 매칭(lazy) -> 중첩 {}가 많으면
        //      이 부분을 더 세심하게 다듬어야 할 수도 있음

        const match = content.match(/ytInitialData\s*=\s*(\{.*?\});/s);
        if (!match) continue; // 해당 스크립트에서 못 찾으면 다음으로

        try {
            // 3. match[1] 이 '{ ... }'에 해당하므로 그대로 JSON.parse
            const globalObj = JSON.parse(match[1]);
            
            // 4. 원하는 데이터를 반환하면 끝
            // console.log(globalObj);
            const markersList = globalObj
                .frameworkUpdates
                .entityBatchUpdate
                .mutations[0]
                .payload
                .macroMarkersListEntity
                .markersList;
            return {markersList};
        } catch (err) {
            console.error(err);
            // 파싱 실패하면 다음 script로 넘어감
        }
    }

    // 아무것도 못 찾았다면
    return {};
}

const parseTitle = async (vid) => {
    const vid_url = youtube_url + vid
    const url = api_url + vid_url;

    const res = await fetch(url);
    const dat = await res.json();
    return dat.title;
}

const checkValidVideo = async (vid) => {

    const vid_url = youtube_url + vid
    const url = api_url + vid_url;

    const res = await fetch(url);
    return res.ok;
}

exports.getVidData = async (vid) => {
    if (!await checkValidVideo(vid)) {
        return  {
            markersList : null,
            vidTitle : null
        };
    }


    const res = await fetch(youtube_url + vid, {
            headers: {"Content-Type": "text/html; charset=UTF-8"}
        }
    );

    const html = await res.text();
    const dom = cheerio.load(html);
    return  {
        markersList : await parseMarkersList(dom),
        vidTitle : await parseTitle(vid)
    };
}
