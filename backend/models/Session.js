const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  skillId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  mentorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  learnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'],
    default: 'pending'
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Index for efficient querying
sessionSchema.index({ mentorId: 1, date: 1 });
sessionSchema.index({ learnerId: 1, date: 1 });
sessionSchema.index({ skillId: 1, date: 1 });

module.exports = mongoose.model('Session', sessionSchema); 