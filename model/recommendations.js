const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const Shows = mongoose.model('Shows', new mongoose.Schema({
    name: { type: String },
    url: { type: String },
    language: { type: String },
    type: { type: String },
    genres: [String],
    upvotes: [String],
    downvotes: [String],
    description: { type: String },
    created_by: { type: String }
  },
  schemaOptions
  ));

  const ShowTypes = mongoose.model('ShowTypes', new mongoose.Schema({
    name: { type: String, required: true }},
    schemaOptions
  ));

  const Genres = mongoose.model('Genres', new mongoose.Schema({
    name: { type: String, required: true }},
    schemaOptions
    ));

  const Languages = mongoose.model('Languages', new mongoose.Schema({
    name: { type: String, required: true }},
    schemaOptions
  ));


exports.Shows = Shows; 
exports.ShowTypes = ShowTypes; 
exports.Genres = Genres; 
exports.Languages = Languages; 