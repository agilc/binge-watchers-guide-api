'use strict';

const { ShowTypes, Languages, Genres, Shows } = require('../model/recommendations');
const logger = require('../util/logger');

exports.getShows = async (res, filterObj) => {
  try{
    logger.debug("category service : listCategory : start");
    let result = await Shows.find(filterObj);
    logger.info("category service : listCategory: result %o",result);
    res.status(200);
    res.json({
      success: true,
      message: "Shows fetched successfully",
      data: result
    });
  }
  catch(error){
    logger.error("category service : listCategory: catch %o",error);
    res.status(500);
    res.json({
      code:"internal_error",
      message: "Server encountered an error, Please try again after some time"
    });
  }
}

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
    let genres = await Genres.find().select('name');;
    let languages = await Languages.find().select('name');;
    let types = await ShowTypes.find().select('name');;

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