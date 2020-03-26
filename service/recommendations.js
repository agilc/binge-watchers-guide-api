'use strict';

const { Recommendations } = require('../model/recommendations');
const logger = require('../util/logger');

exports.createRecommendations = async (res,body) => {
  try{
    logger.debug("category service : createCategory : start");
      const category = new Recommendations(body);
      let result = await category.save();
      logger.info("category service : createCategory: result %o",result);
      res.status(200);
      res.json(result);
  }
  catch(error){
    logger.error("category service : createCategory: catch %o",error);
      res.status(500);
      res.json({
        code:"internal_error",
        message: "Server encountered an error, Please try again after some time"
      });
  } 
}

exports.listRecommendations = async (res, filterObj, id) => {
  try{
    logger.debug("category service : listCategory : start");
    let result = await Recommendations.find(filterObj);
    logger.info("category service : listCategory: result %o",result);
    res.status(200);
    res.json(result);
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
  logger.debug("category service : editCategory : start");
  try{
    let result = await Recommendations.findByIdAndUpdate(id, dataObj);
    if(!result){
      logger.error("category service : editCategory: file not found %o",result);
      res.status(404);
      res.json({
        code:"not_found",
        message: "Resource not found"
      });
    }
    else{
      logger.info("category service : editCategory: result %o",result);
      res.status(200);
      res.json(result);
    }
  }
  catch(error){
    logger.error("category service : editCategory: catch %o",error);
      res.status(500);
      res.json({
        code:"internal_error",
        message: "Server encountered an error, Please try again after some time"
      });
  } 
}

// exports.getCategory = async (res, categoryId) => {
//   try{
//     logger.debug("category service : getCategory : start");
//     let result = await Category.findById(categoryId);
//     logger.debug("category service : getCategory : end");
//     if(!result){
//       logger.error("category service : getCategory: file not found %o",result);
//       res.status(404);
//       res.json({
//         code:"not_found",
//         message: "Resource not found"
//       });
//     }
//     else{
//       logger.info("category service : getCategory: result %o",result);
//       res.status(200);
//       res.json(result);
//     }
//   }
//   catch(error){
//     logger.error("category service : getCategory: catch %o",error);
//     if(error.name === "CastError"){
//       res.status(400);
//       res.json({
//         code:"input_data_issue",
//         message: "Valid id is required"
//       });
//     }
//     else{
//       res.status(500);
//       res.json({
//         code:"internal_error",
//         message: "Server encountered an error, Please try again after some time"
//       });
//     }
//   }
// }

// exports.deleteCategory = async (res,categoryId) => {
//   try{
//     logger.debug("category service : deleteCategory : start");
//     let result = await Category.findByIdAndRemove(categoryId);
//     if(!result){
//       logger.error("category service : deleteCategory: file not found %o",result);
//       res.status(404);
//       res.json({
//         code:"not_found",
//         message: "Resource not found"
//       });
//     }
//     logger.info("category service : deleteCategory: result %o",result);
//     res.status(200);
//     res.json(result);
//   }
//   catch(error){
//     logger.error("category service : deleteCategory: catch %o",error);
//     if(error.name === "CastError"){
//       res.status(400);
//       res.json({
//         code:"input_data_issue",
//         message: "Valid id required"
//       });
//     }
//     res.status(500);
//     res.json({
//       code:"internal_error",
//       message: "Server encountered an error, Please try again after some time"
//     });
//   }
// }