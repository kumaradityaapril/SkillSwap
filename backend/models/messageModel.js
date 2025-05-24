const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  read: {
    type: Boolean,
    default: false
  },
  conversationId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Create a compound index on sender, recipient, and createdAt for efficient querying
messageSchema.index({ conversationId: 1, createdAt: 1 });

// Static method to get conversation between two users
messageSchema.statics.getConversation = async function (userId1, userId2, limit = 50, skip = 0) {
  // Create a unique conversation ID by sorting and concatenating user IDs
  const conversationId = [userId1, userId2].sort().join('_');

  return this.find({ conversationId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('sender', 'name avatar')
    .populate('recipient', 'name avatar');
};

// Static method to get all conversations for a user
messageSchema.statics.getUserConversations = async function (userId) {
  // Find all messages where the user is either sender or recipient
  const messages = await this.aggregate([
    {
      $match: {
        $or: [
          { sender: mongoose.Types.ObjectId(userId) },
          { recipient: mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    // Sort by creation date descending
    { $sort: { createdAt: -1 } },
    // Group by conversation
    {
      $group: {
        _id: "$conversationId",
        lastMessage: { $first: "$$ROOT" },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ["$read", false] },
                  { $eq: ["$recipient", mongoose.Types.ObjectId(userId)] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    // Sort conversations by the last message date
    { $sort: { "lastMessage.createdAt": -1 } }
  ]);

  return messages;
};

module.exports = mongoose.model('Message', messageSchema);