const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Skill'
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session' // Optional: Link review to a specific session
  },
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;