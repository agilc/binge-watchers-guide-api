'use strict';

const { ShowTypes, Languages, Genres } = require('../model/recommendations');
const logger = require('../util/logger');

exports.editRecommendations = async (res, dataObj, id) => {
  logger.debug("recommendations service : editCategory : start");
  try{
    let result = await Recommendations.findByIdAndUpdate(id, dataObj);
    if(!result){
      logger.error("recommendations service : editCategory: file not found %o",result);
      res.status(404);
      res.json({
        code:"not_found",
        message: "Resource not found"
      });
    }
    else{
      logger.info("recommendations service : editCategory: result %o",result);
      res.status(200);
      res.json(result);
    }
  }
  catch(error){
    logger.error("recommendations service : editCategory: catch %o",error);
      res.status(500);
      res.json({
        code:"internal_error",
        message: "Server encountered an error, Please try again after some time"
      });
  } 
}

exports.upvoteRecommendations = async (res, id) => {
  logger.debug("recommendations service : editCategory : start");
  try{
    let result = await Recommendations.findByIdAndUpdate({_id: id}, {$inc: { upvotes: 1} });
    if(!result){
      logger.error("recommendations service : editCategory: file not found %o",result);
      res.status(404);
      res.json({
        code:"not_found",
        message: "Resource not found"
      });
    }
    else{
      logger.info("recommendations service : editCategory: result %o",result);
      res.status(200);
      res.json(result);
    }
  }
  catch(error){
    logger.error("recommendations service : editCategory: catch %o",error);
      res.status(500);
      res.json({
        code:"internal_error",
        message: "Server encountered an error, Please try again after some time"
      });
  } 
}


exports.downvoteRecommendations = async (res, id) => {
  logger.debug("recommendations service : editCategory : start");
  try{
    let result = await Recommendations.findByIdAndUpdate({_id: id}, {$inc: { downvotes: 1} });
    if(!result){
      logger.error("recommendations service : editCategory: file not found %o",result);
      res.status(404);
      res.json({
        code:"not_found",
        message: "Resource not found"
      });
    }
    else{
      logger.info("recommendations service : editCategory: result %o",result);
      res.status(200);
      res.json(result);
    }
  }
  catch(error){
    logger.error("recommendations service : editCategory: catch %o",error);
      res.status(500);
      res.json({
        code:"internal_error",
        message: "Server encountered an error, Please try again after some time"
      });
  } 
}

exports.addShowType = async (res, body) => {
  logger.debug("recommendations service : addShowType : start");
  try{
    let showType = new ShowTypes(body);
    let result = await showType.save();
    res.status(200);
    res.json(result);
  }
  catch(error){
    logger.error("recommendations service : addShowType: catch %o",error);
      res.status(500);
      res.json({
        code:"internal_error",
        message: "Server encountered an error, Please try again after some time"
      });
  } 
}

exports.addLanguages = async (res, body) => {
  logger.debug("recommendations service : addLanguages : start");
  try{
    let lang = new Languages(body);
    let result = await lang.save();
    res.status(200);
    res.json(result);
  }
  catch(error){
    logger.error("recommendations service : addShowType: catch %o",error);
      res.status(500);
      res.json({
        code:"internal_error",
        message: "Server encountered an error, Please try again after some time"
      });
  } 
}

exports.addGenres = async (res, body) => {
  logger.debug("recommendations service : addLanguages : start");
  try{
    let genre = new Genres(body);
    let result = await genre.save();
    res.status(200);
    res.json(result);
  }
  catch(error){
    logger.error("recommendations service : addShowType: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  } 
}

exports.getStatics = async (res) => {
  logger.debug("recommendations service : getStatics : start");
  try{
    let genres = await Genres.find();
    let languages = await Languages.find();
    let types = await ShowTypes.find();

    let response = {
      types: types,
      languages: languages,
      genres: genres
    }

    res.status(200);
    res.json({
      success: true,
      message: "Statics fetched successfully",
      data: response
    });

  }
  catch(error){
    logger.error("recommendations service : getStatics: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}