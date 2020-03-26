'user strict';
const Joi = require('@hapi/joi');

const recommendationsService = require('../service/recommendations');
const logger = require('../util/logger');

exports.listRecommendations = async (req,res) => {
  try{
    logger.debug("category controller : listCategory : start");
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


exports.createRecommendations = async (req,res) => {
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
      recommendationsService.createRecommendations(res,body);
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
    upvote: Joi.boolean(),
    downvote: Joi.boolean()
  });

  const result = await schema.validate(body);
  if(result.error){
    logger.error("category controller : createCategory : Input Validation error %o",result.error);
    return {
      code:"input_data_issue",
      message: result.error.details[0].message.split('\"').join("")
    };
  }
  else{
    logger.info("category controller : createCategory : Input Validation success");
    return false;
  }
}

exports.editRecommendations = async (req,res) => {
  logger.debug("category controller : editCategory : start");

  try{
    let body = req.body;
    const errorMessage = await editInputValidation(body);
    if(errorMessage){
      res.status(400);
      res.json(errorMessage);
    }
    else{
      let dataObj = {};

      let { name, genre, type } = body;
      name && (dataObj["name"] = name);
      genre && (dataObj["genre"] = genre);
      type && (dataObj["type"] = type);
      console.log("dataObj",dataObj);
      recommendationsService.editRecommendations(res,body, body.id);
    }

    logger.debug("category controller : editCategory :end");
  }
  catch(error){
    logger.error("category controller : editCategory: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}

let editInputValidation = async (body) =>{
  const schema = Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string(),
    type: Joi.string(),
    url: Joi.string()
  });

  const result = await schema.validate(body);
  if(result.error){
    logger.error("category controller : editCategory : Input Validation error %o",result.error);
    return {
      code:"input_data_issue",
      message: result.error.details[0].message.split('\"').join("")
    };
  }
  else{
    logger.info("category controller : editCategory : Input Validation success");
    return false;
  }
}

module.exports.createInputValidation = createInputValidation;
module.exports.editInputValidation = editInputValidation;