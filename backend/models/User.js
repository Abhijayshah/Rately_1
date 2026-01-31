const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 60
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true,
    maxlength: 400
  },
  role: {
    type: String,
    enum: ['system_admin', 'normal_user', 'store_owner'],
    default: 'normal_user'
  }
}, {
  timestamps: true // adds created_at and updated_at
});

module.exports = mongoose.model('User', userSchema);
