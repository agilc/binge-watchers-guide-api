require('dotenv').config();

module.exports.MONGODB_URL = process.env.MONGODB_URL;
module.exports.BCRYPT_SALT_ROUND = 12;