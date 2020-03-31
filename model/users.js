const mongoose = require('mongoose');

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
};

const User = mongoose.model(
  'User',
  new mongoose.Schema(
    {
      username: { type: String, require: true },
      password: { type: String, require: true },
      is_admin: { type: Boolean, default: false },
    },
    schemaOptions
  )
);

exports.User = User;
