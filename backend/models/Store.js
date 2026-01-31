const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 60
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true,
    maxlength: 400
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalRatings: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Store', storeSchema);
