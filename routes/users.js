var express = require('express');
var router = express.Router();

let usersController = require('../controller/users');

/* GET users listing. */
router.post('/', usersController.addUser);

module.exports = router;
