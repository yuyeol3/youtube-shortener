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
        const query = db.query(`SELECT * FROM vids_heatmap WHERE id= $id`)
        const res = query.get({$id : vidId});

        // console.log(res);
        return new VidsHeatmap(
            vidId,
            res ? JSON.parse(res.heatmap) : null,
        );
    }

    static async set(vidsHeatmap) {
        const id = vidsHeatmap.vidId;
        const json = JSON.stringify(vidsHeatmap.heatmap);
        const query = db.query(`INSERT INTO vids_heatmap (id, heatmap) VALUES ($id, $json)`);
        query.run({$id : id, $json : json});
        // await db.execute(`INSERT INTO vids_heatmap (id, heatmap) VALUES (?, ?)`, [id, json]);
    }
}


module.exports = VidsHeatmap;