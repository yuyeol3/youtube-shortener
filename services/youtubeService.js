const cheerio = require('cheerio');
const { exec } = require("child_process");

const youtube_url = "https://www.youtube.com/watch?v=";
const api_url = "https://noembed.com/embed?dataType=json&url=";



const parseMarkersList = async (dom) => {
    const scriptTags = dom('script').toArray();
    let markersData = {};

    for (let i = scriptTags.length - 1; i >= 0; i--) {
        const script = scriptTags[i];
        const scriptContent = dom(script).html();

        if (scriptContent.includes('"markersList"')) {
            try {
                const dataStarts = scriptContent.indexOf('"markersList"');
                const brackets = {s : 0, m : 0, b : 0};
                let validContent = false;
                let result = "";
                let idx = dataStarts;
                while ( Object.values(brackets).reduce((p, e)=> p+e) !== 0 ||
                !validContent ) {
                    const c = scriptContent.at(idx++);
                    if (c === "{" || c === "(" || c === "[")
                        validContent = true;

                    switch (c) {
                        case '[': brackets.b++; break;
                        case ']': brackets.b--; break;
                        case '{': brackets.m++; break;
                        case '}': brackets.m--; break;
                        case '(': brackets.s++; break;
                        case ')': brackets.s--; break;
                    }
                    result += c;
                }
                markersData = JSON.parse('{' + result + '}');
                break;
            } catch (error) {
                console.error('JSON 파싱 중 오류 발생:', error);
            }
        }
    }

    return markersData;
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


    const res = await fetch(youtube_url + vid,
        {
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