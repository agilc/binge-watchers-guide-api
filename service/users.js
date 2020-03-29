'use strict';
const { hashSync, compareSync } = require('bcryptjs');

const { BCRYPT_SALT_ROUND } = require('../constants/app');
const { User } = require('../model/users');
const { Shows, Genres, ShowTypes, Languages } = require('../model/recommendations');
const logger = require('../util/logger');
const {generateToken} = require('../util/token');

exports.addUsers = async (res,body) => {
  try{
    logger.debug("users service : addUsers : start");
    let { username, password } = body;
    let user = await User.findOne({username: username});

    if(user){
      logger.error("users service : addUsers: duplicate user %o",user);
      res.status(409);
      res.json({
        status: false,
        code:"conflict",
        message: "This username already exists.",
        data: {
          username
        }
      });
      return;
    }

    user = new User({username: username, password: hashSync(password, BCRYPT_SALT_ROUND ) });
    let result = (await user.save()).toJSON();

    const {password: passwordHash, __v, ...userInfo} = result
    userInfo.token = await generateToken(result._id)


    logger.info("users service : addUsers: result %o",result);
    res.status(201);
    res.json({ 
      status: true,
      code: "ok",
      message: "Registered successfully.",
      data: { user: userInfo }
    });
  }
  catch(error){
    logger.error("users service : addUsers: catch %o",error);
    res.status(500);
    res.json({
      success: false,
      code: "internal_error",
      message: "Server encountered an error, Please try again after some time",
      data: {
        error: error.toString()
      }
    });
  } 
}

exports.loginUser = async (res,body) => {
  try{
    logger.debug("users service : loginUSer : start");
    let { username, password } = body;
    let user = await User.findOne({username: username}).lean();

    if(!user){
      logger.error("users service : loginUSer: invalid user name %o",user);
      res.status(401);
      res.json({
        success: false,
        code:"unauthorized",
        message: "Invalid username or password",
        data: {
          username
        }
      });
      return;
    }

    const isAuthenticated = compareSync(password, user.password);

    if(!isAuthenticated){
      logger.error("users service : loginUSer: invalid password %o",user);
      res.status(401);
      res.json({
        success: false,
        code:"unauthorized",
        message: "Invalid username or password",
        data: {
          username
        }
      });
      return;
    }

    const {password: passwordHash, __v, ...userInfo} = user

    userInfo.token = await generateToken(user._id)

    logger.info("users service : loginUSer: result %o",user);
    res.status(200);
    res.json({
      status: true,
      code: "ok",
      message: "Logged in successfully.",
      data: { user: userInfo }
    });
  }
  catch(error){
    logger.error("users service : loginUSer: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  } 
}

exports.checkUsername = async (res,username) => {
  try{
    logger.debug("users service : loginUSer : start");
    let user = await User.findOne({username: username});

    if(user){
      logger.error("users service : loginUSer: invalid user name %o",user);
      res.status(200);
      res.json({
        success: false,
        code:"exists",
        message: "Username already exists.",
        data: {
          username
        }
      });
      return;
    }

    logger.info("users service : loginUSer: result %o",user);
    res.status(200);
    res.json({
      success: true,
      code:"ok",
      message: "Username doesn't exists.",
      data: {
        username
      }
    });
  }
  catch(error){
    logger.error("users service : loginUSer: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  } 
}

exports.addShow = async (res,body) => {
  try{
    logger.debug("users service : addShow : start");

    console.log("booo",body);
    let user = await User.findById(body.createdBy);
    if(!user){
      res.status(400);
      res.json({
        code:"input_data_issue",
        message: "Invalid user id"
      });
      return;
    }

    console.log("body",body);
    let type;
    let language;
    let genre = true;
    
    type = await ShowTypes.findById(body.type);
    language = await Languages.findById(body.language);
    body.genres.forEach(async item => {
      if(!await Genres.findById(item)){
        genre = false;
      }
    });

    console.log("showTypes",type);
    console.log("language",language);

    if(!genre || !type || !language){
      res.status(400);
      res.json({
        code:"input_data_issue",
        message: "Invalid genres or type or language"
      });
      return;
    }

    const category = new Shows(body);
    let result = await category.save();
    // logger.info("category service : createCategory: result %o",result);
    res.status(200);
    res.json({
      success: true,
      message: "Show added successfully",
      data: {
        show: result
      }
    });
  }
  catch(error){
    logger.error("users service : addShow: catch %o",error);
      res.status(500);
      res.json({
        code:"internal_error",
        message: "Server encountered an error, Please try again after some time"
      });
  } 
}