var express = require('express');
var router = express.Router();

let recommendationsController = require('../controller/recommendations');

/* GET users listing. */
router.post('/', recommendationsController.createRecommendations);
router.get('/', recommendationsController.listRecommendations);
router.put('/', recommendationsController.editRecommendations);
router.post('/upvote', recommendationsController.upvoteRecommendations);
router.post('/downvote', recommendationsController.downvoteRecommendations);

module.exports = router;
