'user strict';
const Joi = require('@hapi/joi');

const usersService = require('../service/users');
const logger = require('../util/logger');

exports.addUser = async (req,res) => {
  try{
    logger.debug("recommendations controller : addUser : start");
    let { ip } = req.body;

    usersService.addUsers(res, ip);
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