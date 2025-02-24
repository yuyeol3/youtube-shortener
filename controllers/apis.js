const { getVidData } = require("../services/youtubeService");
const RecentShortenVid = require(process.cwd() + '/models/recentShortenVid')

exports.getHeatmap = async (req, res, next) => {
    try {
        const videoId = req.params.vid;
        const vidData = await getVidData(videoId);

        if (vidData.markersList.markersList && vidData.vidTitle)
            RecentShortenVid.insert(
                new RecentShortenVid(videoId, vidData.vidTitle)
            );
        vidData.message = ""
        vidData.status = "OK";
        res.json(vidData);
    }
    catch (err) {
        console.error(err);
        res.status(404).json({
            status : "FAILED",
            message: 'invalid video id'
        });
    }
}

exports.getRecentShortenVids = async (req, res, next) => {
    try {
        const data = await RecentShortenVid.get10();
        res.json({
            data : data,
            message : "",
            status : "OK"
        })
    } catch (err) {
        console.error(err);
        res.status(404).json({
            message : "UNKNOWN ERROR",
            status : "FAILED",
        })
    }
}

