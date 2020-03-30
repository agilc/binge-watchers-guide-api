const mongoose = require('mongoose');

const Shows = mongoose.model('Shows', new mongoose.Schema({
    name: { type: String },
    url: { type: String },
    language: { type: String },
    type: { type: String },
    genres: [String],
    upvotes: [String],
    downvotes: [String],
    description: { type: String },
    createdBy: { type: String }
  }));

  const ShowTypes = mongoose.model('ShowTypes', new mongoose.Schema({
    name: { type: String, required: true }
  }));

  const Genres = mongoose.model('Genres', new mongoose.Schema({
    name: { type: String, required: true }
  }));

  const Languages = mongoose.model('Languages', new mongoose.Schema({
    name: { type: String, required: true }
  }));


exports.Shows = Shows; 
exports.ShowTypes = ShowTypes; 
exports.Genres = Genres; 
exports.Languages = Languages; 