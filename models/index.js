const { Database } = require("bun:sqlite");
const {settings} = require("../settings.const");

const db = new Database(
    process.cwd() + "/database/db.sqlite",
    { create : true }
);

db.run(`
    CREATE TABLE IF NOT EXISTS recent_shorten_vids (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      shortCode TEXT NOT NULL,
      title TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS vids_heatmap (
        id TEXT NOT NULL,
        heatmap TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );
`);

setInterval(()=>{
    // console.log("deleting..");
    db.run(`
        DELETE FROM recent_shorten_vids
        WHERE createdAt < datetime('now', '-1 day');
    `);

    db.run(`
        DELETE FROM vids_heatmap
        WHERE createdAt < datetime('now', '-3 day');
    `);
}, settings.DB_CLEANUP_PERIOD_MS);

module.exports = db;

