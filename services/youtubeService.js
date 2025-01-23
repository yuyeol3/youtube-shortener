const cheerio = require('cheerio');

const parseMarkersList = (dom) => {
    const scriptTags = dom('script').toArray();
    let markersData = {};

    for (const script of scriptTags) {
        const scriptContent = dom(script).html();
        // console.log(scriptContent);

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
    return dom('title').html();
}


exports.getVidData = async (vid) => {
    const res = await fetch("https://www.youtube.com/watch?v=" + vid);
    const html = await res.text();
    const dom = cheerio.load(html);
    return  {
        markersList : parseMarkersList(dom),
        vidTitle : dom('title').html()
    };
}