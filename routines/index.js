const cron = require('node-cron');
const RecentShortenVid = require(process.cwd() + '/models/recentShortenVid')

cron.schedule('0 0 * * *', async () => {
    console.log("🔄 Running daily cleanup task...");
    await RecentShortenVid.removeOlds();
    console.log("✅ Cleanup complete.");
}, {
    scheduled: true,
    timezone: "Asia/Seoul" // 한국 시간대 적용
});

console.log("🕒 Cron job scheduled.");
