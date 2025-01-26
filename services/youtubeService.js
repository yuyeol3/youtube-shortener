const cheerio = require('cheerio');

const parseMarkersList = (dom) => {
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

const parseTitle = (dom) => {
    return dom('title').html().replace(' - YouTube', '');
}

exports.getVidData = async (vid) => {
    const res = await fetch("https://www.youtube.com/watch?v=" + vid);

    if (res.url.includes("youtube.com/watch?v=")) {

        const html = await res.text();
        const dom = cheerio.load(html);
        return  {
            markersList : parseMarkersList(dom),
            vidTitle : parseTitle(dom)
        };
    }
    else return  {
        markersList : null,
        vidTitle : null
    };

}