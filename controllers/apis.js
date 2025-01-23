const { getVidData } = require("../services/youtubeService");

exports.getHeatmap = async (req, res, next) => {
    try {
        const videoId = req.params.vid;
        const vidData = await getVidData(videoId);
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

