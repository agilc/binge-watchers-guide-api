'user strict';
const Joi = require('@hapi/joi');

const recommendationsService = require('../service/recommendations');
const logger = require('../util/logger');

exports.getShows = async (req, res) => {
  try{
    logger.debug("recommendations controller : getShows : start");
    let { languages, genres, types, user_id, sort, order } = req.query;
    filterObj = {};

    languages && (filterObj["language"] = {$in: languages.split(',')});
    genres && (filterObj["genres"] = { $in: genres.split(',')} );
    types && (filterObj["type"] = {$in: types.split(',')});

    console.log("filterObj",filterObj);

    logger.debug("category controller : getShows : Search Params %o", filterObj);
    recommendationsService.getShows(res, filterObj, user_id, sort, order);
    logger.debug("category controller : getShows :end");
  }
  catch(error){
    logger.error("category controller : getShows: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}

exports.editRecommendations = async (req,res) => {
  logger.debug("recommendations controller : editCategory : start");

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

    logger.debug("recommendations controller : editCategory :end");
  }
  catch(error){
    logger.error("recommendations controller : editCategory: catch %o",error);
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
    logger.error("recommendations controller : editCategory : Input Validation error %o",result.error);
    return {
      code:"input_data_issue",
      message: result.error.details[0].message.split('\"').join("")
    };
  }
  else{
    logger.info("recommendations controller : editCategory : Input Validation success");
    return false;
  }
}

exports.downvoteRecommendations = async (req,res) => {
  logger.debug("recommendations controller : editCategory : start");

  try{
    let body = req.body;
    recommendationsService.downvoteRecommendations(res,body.id);

    logger.debug("recommendations controller : editCategory :end");
  }
  catch(error){
    logger.error("recommendations controller : editCategory: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}

exports.addShowType = async (req,res) => {
  logger.debug("recommendations controller : addShows : start");

  try{
    let body = req.body;
    recommendationsService.addShowType(res,body);

    logger.debug("recommendations controller : editCategory :end");
  }
  catch(error){
    logger.error("recommendations controller : editCategory: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}

exports.addLanguages = async (req,res) => {
  logger.debug("recommendations controller : addLanguages : start");

  try{
    let body = req.body;
    recommendationsService.addLanguages(res,body);

    logger.debug("recommendations controller : addLanguages :end");
  }
  catch(error){
    logger.error("recommendations controller : addLanguages: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}

exports.addGenres = async (req,res) => {
  logger.debug("recommendations controller : addGenres : start");

  try{
    let body = req.body;
    recommendationsService.addGenres(res,body);

    logger.debug("recommendations controller : addGenres :end");
  }
  catch(error){
    logger.error("recommendations controller : addGenres: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}

exports.getStatics = async(req, res) => {
  logger.debug("recommendations controller : getStatics : start");
  try{
    recommendationsService.getStatics(res);
    logger.debug("recommendations controller : getStatics : end");
  }
  catch(error){
    logger.error("recommendations controller : getStatics: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}


// module.exports.createInputValidation = createInputValidation;
// module.exports.editInputValidation = editInputValidation;