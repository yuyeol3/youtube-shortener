const db = require(process.cwd() + '/models');

/**
 * dp처럼 기존에 불러온 heatMap을 저장하기 위한 모델 클래스
 */
class VidsHeatmap {
    constructor(vidId, heatmap) {
        this.vidId = vidId;
        this.heatmap = heatmap;
    }

    static async get(vidId) {
        const [rows] = await db.execute(`SELECT * FROM vids_heatmap WHERE id=?`, [vidId]);
        const isExist = rows.length > 0;
        // console.log(rows);
        return new VidsHeatmap(
            vidId,
            isExist ? rows[0].heatmap : null,
        );
    }

    static async set(vidsHeatmap) {
        const id = vidsHeatmap.vidId;
        const json = JSON.stringify(vidsHeatmap.heatmap);
        await db.execute(`INSERT INTO vids_heatmap (id, heatmap) VALUES (?, ?)`, [id, json]);
    }
}


module.exports = VidsHeatmap;