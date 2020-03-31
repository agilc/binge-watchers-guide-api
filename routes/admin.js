var express = require('express');
var router = express.Router();

const authorize = require('../middleware/authorize');
const admin = require('../middleware/admin');

let recommendationsController = require('../controller/recommendations');

/* GET users listing. */

router.post(
  '/:userId/showtypes',
  authorize,
  admin,
  recommendationsController.addShowType
);
router.post(
  '/:userId/languages',
  authorize,
  admin,
  recommendationsController.addLanguages
);
router.post(
  '/:userId/genres',
  authorize,
  admin,
  recommendationsController.addGenres
);

module.exports = router;
