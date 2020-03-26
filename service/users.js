'use strict';

const { User } = require('../model/users');
const logger = require('../util/logger');

exports.addUsers = async (res,ip) => {
  try{
    logger.debug("users service : addUsers : start");
    if(ip){
      console.log("ip",ip)
      let user = await User.find({ip: ip});
      console.log("user",user);
      if(user.length){
        res.status(200);
        res.json(user[0]);
        return;
      }
    }
    const user = new User({ip: ip});
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