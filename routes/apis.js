const express = require('express');
const apis = require("../controllers/apis");
const router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {

  res.send('respond with a resource');
});

router.get('/heatmap/:vid', apis.getHeatmap);
router.get('/recent-shorten-vids', apis.getRecentShortenVids);

module.exports = router;
