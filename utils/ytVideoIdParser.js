export default function ytVideoIdParser(youtubeURLText) {
    const youtubeURL = new URL(youtubeURLText);
    let vidId;
    if (youtubeURL.host === "www.youtube.com" || youtubeURL.host === "youtube.com" || youtubeURL.host === "m.youtube.com") {
        vidId = new URLSearchParams(youtubeURL.search).get('v');
    } else if (youtubeURL.host === "youtu.be") {
        vidId = youtubeURL.pathname.replace('/', '');
    } else {
        return null;
    }

    return vidId;
}
