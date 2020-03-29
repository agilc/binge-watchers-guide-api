'user strict';
const Joi = require('@hapi/joi');

const usersService = require('../service/users');
const logger = require('../util/logger');

exports.addUser = async (req,res) => {
  try{
    logger.debug("recommendations controller : addUser : start");
    let body = req.body;

    usersService.addUsers(res, body);
    logger.debug("category controller : addUser :end");
  }
  catch(error){
    logger.error("category controller : addUser: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}

exports.loginUser = async (req,res) => {
  try{
    logger.debug("recommendations controller : addUser : start");
    let body = req.body;

    usersService.loginUser(res, body);
    logger.debug("category controller : addUser :end");
  }
  catch(error){
    logger.error("category controller : addUser: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}

exports.checkUsername = async (req,res) => {
  try{
    logger.debug("recommendations controller : addUser : start");
    let { username } = req.params;

    usersService.checkUsername(res, username);
    logger.debug("category controller : addUser :end");
  }
  catch(error){
    logger.error("category controller : addUser: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}