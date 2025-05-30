const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  skill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  learner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: [true, 'Please provide a date for the session']
  },
  startTime: {
    type: String,
    required: [true, 'Please provide a start time']
  },
  endTime: {
    type: String,
    required: [true, 'Please provide an end time']
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot be more than 500 characters']
  },
  meetingLink: {
    type: String
  },
  learnerFeedback: {
    type: Boolean,
    default: false
  },
  mentorFeedback: {
    type: Boolean,
    default: false
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

// Index for efficient queries
sessionSchema.index({ learner: 1, mentor: 1, date: 1 });
sessionSchema.index({ status: 1 });

// Virtual for related review
sessionSchema.virtual('review', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'session',
  justOne: true
});

module.exports = mongoose.model('Session', sessionSchema);