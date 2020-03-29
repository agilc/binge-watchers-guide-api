const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
    username: { type: String, require: true },
    password: { type: String, require: true }
  }));


exports.User = User; 