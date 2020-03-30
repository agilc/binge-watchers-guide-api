var express = require('express');
var router = express.Router();

let usersController = require('../controller/users');

/* GET users listing. */
router.post('/', usersController.addUser);
router.post('/auth', usersController.loginUser);
router.get('/username/:username', usersController.checkUsername);
router.post('/:userId/shows', usersController.addShow);
router.post('/:userId/shows/:showId/upvote', usersController.upvoteShow);

module.exports = router;
