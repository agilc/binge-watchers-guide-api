'use strict';

const {
  ShowTypes,
  Languages,
  Genres,
  Shows,
} = require('../model/recommendations');
const logger = require('../util/logger');

exports.getShows = async (res, filterObj, user_id, sort, order) => {
  try {
    logger.debug('category service : listCategory : start');
    if (!sort) sort = 'created_at';
    else if (sort === 'popularity') sort = 'upvotes';

    if (order === 'asc') order = 1;
    else order = -1;

    let result;
    if (sort === 'created_at')
      result = await Shows.find(filterObj).sort({ created_at: order });
    else
      await Shows.aggregate(
        [
          {
            $project: {
              _id: 1,
              name: 1,
              type: 1,
              url: 1,
              language: 1,
              genres: 1,
              upvotes: 1,
              downvotes: 1,
              created_by: 1,
              created_at: 1,
              updated_at: 1,
              is_active: 1,
              length: { $size: '$' + sort },
            },
          },
          { $match: filterObj },
          { $sort: { length: order } },
        ],
        function(err, results) {
          result = results;
          console.log('results', result);
        }
      );

    // logger.info("category service : listCategory: result %o",result);

    // let newResult = result.map(item => {
    //   let tempItem = item;
    //   console.log("item",item);
    //   return{ ...tempItem, upvotes: tempItem.upvotes.length, downvotes: tempItem.downvotes.length}
    // })
    let newResult = [];
    result.forEach(item => {
      let updatedValue = {
        _id: item._id,
        name: item.name,
        type: item.type,
        url: item.url,
        language: item.language,
        genres: item.genres,
        upvotes: item.upvotes.length,
        downvotes: item.downvotes.length,
        created_by: item.created_by,
        created_at: item.created_at,
        updated_at: item.updated_at,
        is_active: item.is_active,
      };

      if (user_id) {
        item.upvotes.includes(user_id) && (updatedValue['haveUpvoted'] = true);
        item.downvotes.includes(user_id) &&
          (updatedValue['haveDownvoted'] = true);
      }

      newResult.push(updatedValue);
    });

    // console.log("newResult",newResult)

    res.status(200);
    res.json({
      success: true,
      message: 'Shows fetched successfully',
      data: {
        shows: newResult,
      },
    });
  } catch (error) {
    logger.error('category service : listCategory: catch %o', error);
    res.status(500);
    res.json({
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
    });
  }
};

exports.editRecommendations = async (res, dataObj, id) => {
  logger.debug('recommendations service : editCategory : start');
  try {
    let result = await Recommendations.findByIdAndUpdate(id, dataObj);
    if (!result) {
      logger.error(
        'recommendations service : editCategory: file not found %o',
        result
      );
      res.status(404);
      res.json({
        code: 'not_found',
        message: 'Resource not found',
      });
    } else {
      logger.info('recommendations service : editCategory: result %o', result);
      res.status(200);
      res.json(result);
    }
  } catch (error) {
    logger.error('recommendations service : editCategory: catch %o', error);
    res.status(500);
    res.json({
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
    });
  }
};

exports.downvoteRecommendations = async (res, id) => {
  logger.debug('recommendations service : editCategory : start');
  try {
    let result = await Recommendations.findByIdAndUpdate(
      { _id: id },
      { $inc: { downvotes: 1 } }
    );
    if (!result) {
      logger.error(
        'recommendations service : editCategory: file not found %o',
        result
      );
      res.status(404);
      res.json({
        code: 'not_found',
        message: 'Resource not found',
      });
    } else {
      logger.info('recommendations service : editCategory: result %o', result);
      res.status(200);
      res.json(result);
    }
  } catch (error) {
    logger.error('recommendations service : editCategory: catch %o', error);
    res.status(500);
    res.json({
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
    });
  }
};

exports.addShowType = async (res, body) => {
  logger.debug('recommendations service : addShowType : start');
  try {
    let showType = new ShowTypes(body);
    let result = await showType.save();
    res.status(200);
    res.json(result);
  } catch (error) {
    logger.error('recommendations service : addShowType: catch %o', error);
    res.status(500);
    res.json({
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
    });
  }
};

exports.addLanguages = async (res, body) => {
  logger.debug('recommendations service : addLanguages : start');
  try {
    let lang = new Languages(body);
    let result = await lang.save();
    res.status(200);
    res.json(result);
  } catch (error) {
    logger.error('recommendations service : addShowType: catch %o', error);
    res.status(500);
    res.json({
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
    });
  }
};

exports.addGenres = async (res, body) => {
  logger.debug('recommendations service : addLanguages : start');
  try {
    let genre = new Genres(body);
    let result = await genre.save();
    res.status(200);
    res.json(result);
  } catch (error) {
    logger.error('recommendations service : addShowType: catch %o', error);
    res.status(500);
    res.json({
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
    });
  }
};

exports.getStatics = async res => {
  logger.debug('recommendations service : getStatics : start');
  try {
    let genres = await Genres.find().select('name');
    let languages = await Languages.find().select('name');
    let types = await ShowTypes.find().select('name');

    let response = {
      types: types,
      languages: languages,
      genres: genres,
    };

    res.status(200);
    res.json({
      success: true,
      message: 'Statics fetched successfully',
      data: response,
    });
  } catch (error) {
    logger.error('recommendations service : getStatics: catch %o', error);
    res.status(500);
    res.json({
      code: 'internal_error',
      message: 'Server encountered an error, Please try again after some time',
    });
  }
};
