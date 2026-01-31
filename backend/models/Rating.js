const mongoose = require('mongoose');
const Store = require('./Store');

const ratingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Prevent duplicate ratings from same user to same store
ratingSchema.index({ user: 1, store: 1 }, { unique: true });

// Static method to get average rating
ratingSchema.statics.calculateAverageRating = async function(storeId) {
  const stats = await this.aggregate([
    {
      $match: { store: storeId }
    },
    {
      $group: {
        _id: '$store',
        averageRating: { $avg: '$rating' },
        totalRatings: { $sum: 1 }
      }
    }
  ]);

  try {
    await Store.findByIdAndUpdate(storeId, {
      averageRating: stats.length > 0 ? Number(stats[0].averageRating.toFixed(1)) : 0,
      totalRatings: stats.length > 0 ? stats[0].totalRatings : 0
    });
  } catch (err) {
    console.error(err);
  }
};

// Call calculateAverageRating after save
ratingSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.store);
});

// Call calculateAverageRating before remove (if you implement delete)
// Note: findOneAndDelete/findOneAndRemove triggers might be needed depending on implementation

module.exports = mongoose.model('Rating', ratingSchema);
