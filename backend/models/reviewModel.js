const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Prevent duplicate reviews (one review per user per session)
reviewSchema.index({ session: 1, reviewer: 1 }, { unique: true });

// Index for efficient queries
reviewSchema.index({ skill: 1, rating: 1 });
reviewSchema.index({ reviewee: 1 });

// Static method to calculate average rating for a skill
reviewSchema.statics.calculateAverageRating = async function(skillId) {
  const stats = await this.aggregate([
    {
      $match: { skill: skillId }
    },
    {
      $group: {
        _id: '$skill',
        averageRating: { $avg: '$rating' },
        ratingsCount: { $sum: 1 }
      }
    }
  ]);

  if (stats.length > 0) {
    await this.model('Skill').findByIdAndUpdate(skillId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal place
      ratingsCount: stats[0].ratingsCount
    });
  } else {
    await this.model('Skill').findByIdAndUpdate(skillId, {
      averageRating: 0,
      ratingsCount: 0
    });
  }
};

// Call calculateAverageRating after save
reviewSchema.post('save', function() {
  this.constructor.calculateAverageRating(this.skill);
});

// Call calculateAverageRating after remove
reviewSchema.post('remove', function() {
  this.constructor.calculateAverageRating(this.skill);
});

module.exports = mongoose.model('Review', reviewSchema);