const mongoose = require('mongoose');

const Recommendations = mongoose.model('Recommendations', new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    type: { },
    url: { type: String },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    // timestamp: true
  }));


exports.Recommendations = Recommendations; 