const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  lastMessageText: {
    type: String,
    trim: true
  },
  lastMessageDate: {
    type: Date
  },
  unreadCount: {
    type: Map,
    of: Number,
    default: {}
  }
}, {
  timestamps: true
});

// Ensure participants are unique and limited to 2 for direct messages
conversationSchema.pre('save', function (next) {
  // Remove duplicates
  this.participants = [...new Set(this.participants.map(p => p.toString()))];

  // Ensure there are exactly 2 participants for direct messages
  if (this.participants.length !== 2) {
    return next(new Error('A conversation must have exactly 2 participants'));
  }

  next();
});

// Create a compound index on participants for efficient querying
conversationSchema.index({ participants: 1 });

// Static method to find or create a conversation between two users
conversationSchema.statics.findOrCreateConversation = async function (userId1, userId2) {
  // Find existing conversation
  const existingConversation = await this.findOne({
    participants: { $all: [userId1, userId2] }
  }).populate('participants', 'name avatar');

  if (existingConversation) {
    return existingConversation;
  }

  // Create new conversation if none exists
  const newConversation = await this.create({
    participants: [userId1, userId2],
    unreadCount: new Map([[userId1.toString(), 0], [userId2.toString(), 0]])
  });

  return this.findById(newConversation._id).populate('participants', 'name avatar');
};

// Static method to get all conversations for a user
conversationSchema.statics.getUserConversations = async function (userId) {
  return this.find({
    participants: userId
  })
    .populate('participants', 'name avatar')
    .populate('lastMessage')
    .sort({ lastMessageDate: -1 });
};

// Method to update the last message in a conversation
conversationSchema.methods.updateLastMessage = async function (messageId, messageText) {
  this.lastMessage = messageId;
  this.lastMessageText = messageText;
  this.lastMessageDate = new Date();
  return this.save();
};

// Method to increment unread count for a user
conversationSchema.methods.incrementUnreadCount = async function (userId) {
  const userIdStr = userId.toString();
  const currentCount = this.unreadCount.get(userIdStr) || 0;
  this.unreadCount.set(userIdStr, currentCount + 1);
  return this.save();
};

// Method to reset unread count for a user
conversationSchema.methods.resetUnreadCount = async function (userId) {
  this.unreadCount.set(userId.toString(), 0);
  return this.save();
};

const Conversation = mongoose.model('Conversation', conversationSchema);
module.exports = Conversation;