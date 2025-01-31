const cheerio = require('cheerio');
const { exec } = require("child_process");

const youtube_url = "https://www.youtube.com/watch?v=";
const api_url = "https://noembed.com/embed?dataType=json&url=";

const getParseMarkersList = async (vid) => {
    return new Promise((resolve, reject) => {
        exec("./fetch " + vid, (error, stdout, stderr)=>{
            if (error) reject(error);
            if (stderr) reject(stderr);
            resolve(stdout);
        })
    })
}

const parseMarkersList = async (vid) => {
    try {
        const res = await getParseMarkersList(vid);
        return JSON.parse('{' + res + '}');
    } catch (err) {
        console.error(err);
        return {};
    }
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


    // const res = await fetch(youtube_url + vid,
    //     {
    //         headers: {"Content-Type": "text/html; charset=UTF-8"}
    //     }
    // );

    // const html = await res.text();
    // const dom = cheerio.load(html);
    return  {
        markersList : await parseMarkersList(vid),
        vidTitle : await parseTitle(vid)
    };
}