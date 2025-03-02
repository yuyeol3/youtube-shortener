const db = require(process.cwd() + '/models')

class RecentShortenVid {
    constructor(shortCode, title) {
        this.shortCode = shortCode;
        this.title = title;
    }

    static async insert(recentShortenVid) {
        const query = db.query(`INSERT INTO recent_shorten_vids (shortCode, title) VALUES ($shortCode ,$title)`);
        query.run({
            $shortCode : recentShortenVid.shortCode,
            $title : recentShortenVid.title
        })
        // await db.execute(`INSERT INTO recent_shorten_vids (shortCode, title)
        //             VALUES (? ,?)`, [recentShortenVid.shortCode, recentShortenVid.title]);
    }

    static async get10() {
        const rows = await db.query(`
            SELECT * FROM recent_shorten_vids
             ORDER BY id DESC
             LIMIT 20 
        `).all();

        // console.log(rows);
        if (rows.length < 0)
            return [];

        const identityMap = new Map();
        for (const row of rows) {
            identityMap.set(row.shortCode, row);
        }
        // console.log(identityMap);
        return Array.from(identityMap.values());
    }

    static async removeOlds(){
        // await db.execute(`
        //     DELETE FROM recent_shorten_vids
        //     WHERE createdAt < NOW() - INTERVAL 7 DAY;
        // `);
    }


}

module.exports = RecentShortenVid;