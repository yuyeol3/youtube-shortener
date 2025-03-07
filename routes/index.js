const express = require('express');
const router = express.Router();
const {getVidTitle} = require('../services/youtubeService');
const ytVideoIdParser = require("../utils/ytVideoIdParser");
const settingsConst = require("../settings.const");

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

// router.get('/share', async (req, res, next)=>{
//   const ytUrl = req.query.text;
//   const id = ytVideoIdParser(ytUrl);
//   res.redirect(`/share/${id}/${settingsConst.DEFAULT_THRESHOLD}`);
// })

router.get('/share/:id/:threshold',async (req, res, next) => {
  const {id, threshold} = req.params;
  const title = await getVidTitle(id);
  res.render('share', { title, id: encodeURI(id), threshold: encodeURI(threshold) });
});


module.exports = router;
