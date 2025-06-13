const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for your skill'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: [
      'Programming',
      'Design',
      'Marketing',
      'Business',
      'Music',
      'Language',
      'Cooking',
      'Fitness',
      'Academic',
      'Other'
    ]
  },
  tags: [{
    type: String,
    trim: true
  }],
  level: {
    type: String,
    required: [true, 'Please select a level'],
    enum: ['Beginner', 'Intermediate', 'Advanced', 'All Levels']
  },
  image: {
    type: String,
    default: 'default-skill.jpg'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  availability: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    startTime: String,
    endTime: String
  }],
  averageRating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    default: 0
  },
  ratingsCount: {
    type: Number,
    default: 0
  },
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  isActive: {
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

// Virtual for reviews
skillSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'skill'
});

// Virtual for sessions
skillSchema.virtual('sessions', {
  ref: 'Session',
  localField: '_id',
  foreignField: 'skill'
});

// Index for search functionality
skillSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Skill', skillSchema);