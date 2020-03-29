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

exports.listRecommendations = async (req,res) => {
  try{
    logger.debug("recommendations controller : listCategory : start");
    let { name, genre, type } = req.query;
    filterObj = {};

    name && (filterObj["name"] = name);
    genre && (filterObj["genre"] = genre);
    type && (filterObj["type"] = type);
    console.log("filterObj",filterObj);

    logger.debug("category controller : listCategory : Search Params %o", filterObj);
    recommendationsService.listRecommendations(res, filterObj);
    logger.debug("category controller : listCategory :end");
  }
  catch(error){
    logger.error("category controller : listCategory: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}


exports.addShow = async (req,res) => {
  logger.debug("recommendations controller : listRecommendations : start");

  try{
    let body = req.body;
    
    logger.debug("recommendations controller : listRecommendations : Input Validation");
    const errorMessage = await createInputValidation(body);
    if(errorMessage){
      res.status(400);
      res.json(errorMessage);
    }
    else{
      let { userId } = req.params;
      body['createdBy'] = userId;
      usersService.addShow(res,body);
    }
    logger.debug("recommendations controller : listRecommendations :end");
  }
  catch(error){
    logger.error("recommendations controller : listRecommendations: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}

let createInputValidation = async (body) =>{
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
    type: Joi.string().required(),
    url: Joi.string().required(),
    language: Joi.string().required(),
    genres: Joi.array().required()
  });

  const result = await schema.validate(body);
  if(result.error){
    logger.error("recommendations controller : createCategory : Input Validation error %o",result.error);
    return {
      code:"input_data_issue",
      message: result.error.details[0].message.split('\"').join("")
    };
  }
  else{
    logger.info("recommendations controller : createCategory : Input Validation success");
    return false;
  }
}