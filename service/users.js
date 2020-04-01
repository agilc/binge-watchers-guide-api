'use strict';
const { hashSync, compareSync } = require('bcryptjs');

const { BCRYPT_SALT_ROUND } = require('../constants/app');
const { User } = require('../model/users');
const {
  Shows,
  Genres,
  ShowTypes,
  Languages,
} = require('../model/recommendations');
const logger = require('../util/logger');
const { generateToken } = require('../util/token');

exports.addUsers = async (res, body) => {
  try {
    logger.debug('users service : addUsers : start');
    let { username, password } = body;
    let user = await User.findOne({ username: username });

    if (user) {
      logger.error('users service : addUsers: duplicate user %o', user);
      res.status(409);
      res.json({
        status: false,
        code: 'conflict',
        message: 'This username already exists.',
        data: {
          username,
        },
      });
      return;
    }

    user = new User({
      username: username,
      password: hashSync(password, BCRYPT_SALT_ROUND),
    });
    let result = (await user.save()).toJSON();

    const { password: passwordHash, __v, ...userInfo } = result;
    userInfo.token = await generateToken(result._id);

    logger.info('users service : addUsers: result %o', result);
    res.status(201);
    res.json({
      status: true,
      code: 'ok',
      message: 'Registered successfully.',
      data: { user: userInfo },
    });
  } catch (error) {
    logger.error('users service : addUsers: catch %o', error);
    res.status(500);
    res.json({
      success: false,
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
      data: {
        error: error.toString(),
      },
    });
  }
};

exports.loginUser = async (res, body) => {
  try {
    logger.debug('users service : loginUSer : start');
    let { username, password } = body;
    let user = await User.findOne({ username: username }).lean();

    if (!user) {
      logger.error('users service : loginUSer: invalid user name %o', user);
      res.status(401);
      res.json({
        success: false,
        code: 'unauthorized',
        message: 'Invalid username or password',
        data: {
          username,
        },
      });
      return;
    }

    const isAuthenticated = compareSync(password, user.password);

    if (!isAuthenticated) {
      logger.error('users service : loginUSer: invalid password %o', user);
      res.status(401);
      res.json({
        success: false,
        code: 'unauthorized',
        message: 'Invalid username or password',
        data: {
          username,
        },
      });
      return;
    }

    const { password: passwordHash, __v, ...userInfo } = user;

    userInfo.token = await generateToken(user._id);

    logger.info('users service : loginUSer: result %o', user);
    res.status(200);
    res.json({
      status: true,
      code: 'ok',
      message: 'Logged in successfully.',
      data: { user: userInfo },
    });
  } catch (error) {
    logger.error('users service : loginUSer: catch %o', error);
    res.status(500);
    res.json({
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
    });
  }
};

exports.checkUsername = async (res, username) => {
  try {
    logger.debug('users service : loginUSer : start');
    let user = await User.findOne({ username: username });

    if (user) {
      logger.error('users service : loginUSer: invalid user name %o', user);
      res.status(200);
      res.json({
        success: false,
        code: 'exists',
        message: 'Username already exists.',
        data: {
          username,
        },
      });
      return;
    }

    logger.info('users service : loginUSer: result %o', user);
    res.status(200);
    res.json({
      success: true,
      code: 'ok',
      message: "Username doesn't exists.",
      data: {
        username,
      },
    });
  } catch (error) {
    logger.error('users service : loginUSer: catch %o', error);
    res.status(500);
    res.json({
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
    });
  }
};

exports.addShow = async (res, body) => {
  try {
    logger.debug('users service : addShow : start');

    console.log('booo', body);
    let user = await User.findById(body.created_by);
    if (!user) {
      res.status(400);
      res.json({
        code: 'input_data_issue',
        message: 'Invalid user id',
      });
      return;
    }

    console.log('body', body);
    let type;
    let language;
    let genre = true;

    type = await ShowTypes.findById(body.type);
    language = await Languages.findById(body.language);
    body.genres.forEach(async item => {
      if (!(await Genres.findById(item))) {
        genre = false;
      }
    });

    console.log('showTypes', type);
    console.log('language', language);

    if (!genre || !type || !language) {
      res.status(400);
      res.json({
        code: 'input_data_issue',
        message: 'Invalid genres or type or language',
      });
      return;
    }

    const show = new Shows(body);
    let result = (await show.save()).toObject();
    result.upvotes = 0;
    result.downvotes = 0;
    console.log('res', result);
    // logger.info("category service : createCategory: result %o",result);
    res.status(201);
    res.json({
      success: true,
      message: 'Show added successfully',
      data: {
        show: result,
      },
    });
  } catch (error) {
    logger.error('users service : addShow: catch %o', error);
    res.status(500);
    res.json({
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
    });
  }
};

exports.upvoteShow = async (res, body) => {
  logger.debug('users service : upvoteShow : start');
  try {
    let show = await Shows.findById(body.showId);
    let haveUpvoted, haveDownvoted, message;

    if (!show) {
      logger.error('users service : upvoteShow: file not found %o', show);
      res.status(404);
      res.json({
        success: false,
        message: 'Invalid show',
        data: {},
      });
      return;
    }

    if (body.isUpvote) {
      haveDownvoted = false;
      haveUpvoted = true;
      message = 'Show upvoted successfully';
      show = await Shows.findOneAndUpdate(
        { _id: body.showId },
        {
          $addToSet: {
            upvotes: body.userId,
          },
          $pull: { downvotes: body.userId },
        },
        { new: true }
      ).lean();
    } else {
      haveDownvoted = false;
      haveUpvoted = false;
      message = 'Removed your upvote';
      show = await Shows.findOneAndUpdate(
        { _id: body.showId },
        {
          $pull: {
            upvotes: body.userId,
          },
        },
        { new: true }
      ).lean();
    }

    const showInfo = {
      ...show,
      upvotes: show.upvotes.length,
      downvotes: show.downvotes.length,
      haveUpvoted: haveUpvoted,
      haveDownvoted: haveDownvoted,
    };

    logger.info('users service : upvoteShow: result %o', show);
    res.status(200);
    res.json({
      success: true,
      message: message,
      data: {
        show: showInfo,
      },
    });
  } catch (error) {
    logger.error('recommendations service : editCategory: catch %o', error);
    res.status(500);
    res.json({
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
    });
  }
};

exports.downvoteShow = async (res, body) => {
  logger.debug('users service : downvoteShow : start');
  try {
    let show = await Shows.findById(body.showId);
    let haveUpvoted, haveDownvoted, message;

    if (!show) {
      logger.error('users service : downvoteShow: file not found %o', show);
      res.status(404);
      res.json({
        success: false,
        message: 'Invalid show',
        data: {},
      });
      return;
    }

    if (body.isDownvote) {
      haveDownvoted = true;
      haveUpvoted = false;
      message = 'Show downvoted successfully';
      show = await Shows.findOneAndUpdate(
        { _id: body.showId },
        {
          $addToSet: {
            downvotes: body.userId,
          },
          $pull: { upvotes: body.userId },
        },
        { new: true }
      ).lean();
    } else {
      haveDownvoted = false;
      haveUpvoted = false;
      message = 'Removed your downvote';
      show = await Shows.findOneAndUpdate(
        { _id: body.showId },
        {
          $pull: {
            downvotes: body.userId,
          },
        },
        { new: true }
      ).lean();
    }

    const showInfo = {
      ...show,
      upvotes: show.upvotes.length,
      downvotes: show.downvotes.length,
      haveUpvoted: haveUpvoted,
      haveDownvoted: haveDownvoted,
    };

    {
    }

    logger.info('users service : downvoteShow: result %o', show);
    res.status(200);
    res.json({
      success: true,
      message: message,
      data: {
        show: showInfo,
      },
    });
  } catch (error) {
    logger.error('users service : downvoteShow: catch %o', error);
    res.status(500);
    res.json({
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
    });
  }
};

exports.deleteShow = async (res, body) => {
  logger.debug('users service : deleteShow : start');
  try {
    let show = await Shows.findOne({ _id: body.showId });
    console.log('creaa', show.created_by);
    console.log('body.userId', body.userId);

    if (show.created_by != body.userId) {
      res.status(403);
      res.json({
        success: false,
        message: "You don't have permission to delete this show",
        data: {
          show: show,
        },
      });
    } else {
      show.is_active = false;
      show = await show.save();
      res.status(200);
      res.json({
        success: true,
        message: 'Show deleted successfully',
        data: {
          show: show,
        },
      });
    }
    logger.info('users service : downvoteShow: result %o', show);
  } catch (error) {
    logger.error('users service : downvoteShow: catch %o', error);
    res.status(500);
    res.json({
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
    });
  }
};
