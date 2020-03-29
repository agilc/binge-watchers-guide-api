var express = require('express');
var router = express.Router();

let usersController = require('../controller/users');

/* GET users listing. */
router.post('/', usersController.addUser);
router.post('/auth', usersController.loginUser);
// router.post('/:userId/shows/:showId/upvote', usersController.upvoteRecommendations);

module.exports = router;
