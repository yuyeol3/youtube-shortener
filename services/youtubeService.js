const cheerio = require('cheerio');

const youtube_url = "https://www.youtube.com/watch?v=";
const api_url = "https://noembed.com/embed?dataType=json&url=";

const parseYoutubeInitialData = async (dom) => {
    // 1. 모든 <script> 태그의 내용을 확인
    const scripts = dom('script');
    // 주로 뒷 부분에 전역 객채가 있으므로 뒷부분부터 확인
    const start = scripts.length - 1;
    const end = scripts.length - 10; // 10개만 확인
    for (let i = start; i >= end; i--) {
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
            return globalObj;
        } 
        catch (err) {
            console.error(err);
            // 파싱 실패하면 다음 script로 넘어감
        }
    }

    // 아무것도 못 찾았다면
    return {};
}

const parseMarkersList = async (data) => {
    try {
        const markersList = data
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

    // 아무것도 못 찾았다면
    return null;
}

const parseTitle = async (data) => {
    try {
        return data
            .contents
            .twoColumnWatchNextResults
            .results
            .results
            .contents[0]
            .videoPrimaryInfoRenderer
            .title
            .runs[0]
            .text;
    }
    catch (err){
        console.error(err);
    }
    return null;
}

const checkValidVideo = async (vid) => {

    const vid_url = youtube_url + vid
    const url = api_url + vid_url;

    const res = await fetch(url);
    return res.ok;
}

exports.getVidData = async (vid) => {

    const res = await fetch(youtube_url + vid, {
            headers: {"Content-Type": "text/html; charset=UTF-8"}
        }
    );

    const html = await res.text();
    const dom = cheerio.load(html);
    const data = await parseYoutubeInitialData(dom);
    const [markersList, vidTitle] = 
        await Promise.all([parseMarkersList(data), parseTitle(data)])
    return  {markersList, vidTitle};
}
