const express = require('express');
const router = express.Router();
const {getVidTitle} = require('../services/youtubeService');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/share/:id/:threshold',async (req, res, next) => {
  const {id, threshold} = req.params;
  const title = await getVidTitle(id);
  res.render('share', { title, id, threshold });
});

module.exports = router;
