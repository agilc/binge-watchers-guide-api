'use strict';
const { hashSync, compareSync } = require('bcryptjs');

const { BCRYPT_SALT_ROUND } = require('../constants/app');
const { User } = require('../model/users');
const logger = require('../util/logger');

exports.addUsers = async (res,body) => {
  try{
    logger.debug("users service : addUsers : start");
    let { username, password } = body;
    let user = await User.find({username: username});

    if(user.length){
      logger.error("users service : addUsers: duplicate user %o",user);
      res.status(409);
      res.json({
        code:"conflisct",
        message: "User already exists"
      });
      return;
    }

    user = new User({username: username, password: hashSync(password, BCRYPT_SALT_ROUND ) });
    let result = await user.save();
    logger.info("users service : addUsers: result %o",result);
    res.status(200);
    res.json(result);
  }
  catch(error){
    logger.error("users service : addUsers: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  } 
}

exports.loginUser = async (res,body) => {
  try{
    logger.debug("users service : loginUSer : start");
    let { username, password } = body;
    let user = await User.find({username: username});

    if(!user.length){
      logger.error("users service : loginUSer: invalid user name %o",user);
      res.status(401);
      res.json({
        code:"unauthorized",
        message: "Invalid username"
      });
      return;
    }

    const isAuthenticated = compareSync(password, user[0].password);

    if(!isAuthenticated){
      logger.error("users service : loginUSer: invalid password %o",user);
      res.status(401);
      res.json({
        code:"unauthorized",
        message: "Invalid password"
      });
      return;
    }

    logger.info("users service : loginUSer: result %o",user);
    res.status(200);
    res.json(user);
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