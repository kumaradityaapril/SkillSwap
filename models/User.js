const userSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['learner', 'mentor'],
    required: true
  },
  
  workingHours: {
    start: {
      type: String,
      default: '09:00'
    },
    end: {
      type: String,
      default: '18:00'
    }
  },
}); 