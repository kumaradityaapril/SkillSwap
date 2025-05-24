const express = require('express');
const { protect } = require('../middleware/auth');
const {
  sendMessage,
  getConversation,
  getUserConversations,
  markMessagesAsRead,
  deleteMessage
} = require('../controllers/messageController');

const router = express.Router();

// Protect all routes
router.use(protect);

// Send a message
router.post('/', sendMessage);

// Get all conversations for the current user
router.get('/conversations', getUserConversations);

// Get conversation with a specific user
router.get('/conversation/:userId', getConversation);

// Mark messages in a conversation as read
router.put('/read/:conversationId', markMessagesAsRead);

// Delete a message
router.delete('/:id', deleteMessage);

module.exports = router;