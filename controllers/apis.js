const { getVidData } = require("../services/youtubeService");
const RecentShortenVid = require(process.cwd() + '/models/recentShortenVid')
const VidsHeatmap = require(process.cwd() + '/models/vidsHeatmap');

exports.getHeatmap = async (req, res, next) => {
    try {
        const videoId = req.params.vid;
        // 데이터베이스에 요청, 존재 확인
        const dbHeatmap = await VidsHeatmap.get(videoId);
        // 존재하면 db 데이터, 아니면 유튜브로 요청
        const heatMap = dbHeatmap.heatmap ? dbHeatmap : await getVidData(videoId);
        const vidData = heatMap.heatmap;  
        if (vidData.markersList.markersList && vidData.vidTitle) {
            RecentShortenVid.insert(
                new RecentShortenVid(videoId, vidData.vidTitle)
            );
            
            // db에 없었으면 추가
            if (!dbHeatmap.heatmap)
                VidsHeatmap.set(heatMap);
        }
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

