var express = require('express');
var router = express.Router();

let recommendationsController = require('../controller/recommendations');

/* GET users listing. */
router.get('/', recommendationsController.getShows);
router.post('/downvote', recommendationsController.downvoteRecommendations);
// router.post('/showtypes', recommendationsController.addShowType);
// router.post('/languages', recommendationsController.addLanguages);
// router.post('/genres', recommendationsController.addGenres);
router.get('/statics', recommendationsController.getStatics);

module.exports = router;
