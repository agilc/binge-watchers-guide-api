var express = require('express');
var router = express.Router();

const authorize = require('../middleware/authorize');

let usersController = require('../controller/users');

/* GET users listing. */
router.post('/', usersController.addUser);
router.post('/auth', usersController.loginUser);
router.get('/username/:username', usersController.checkUsername);

router.post('/:userId/shows', authorize, usersController.addShow);

router.post(
  '/:userId/shows/:showId/upvote',
  authorize,
  usersController.upvoteShow
);

router.post(
  '/:userId/shows/:showId/downvote',
  authorize,
  usersController.downvoteShow
);

router.delete('/:userId/shows/:showId', authorize, usersController.deleteShow);

module.exports = router;
