const mongoose = require('mongoose');

const Recommendations = mongoose.model('Recommendations', new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    type: { },
    url: { type: String },
    upvotes: { type: Boolean },
    downvotes: { type: Boolean },
    // timestamp: true
  }));


exports.Recommendations = Recommendations; 