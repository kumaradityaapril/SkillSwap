const Message = require('../models/messageModel');
const Conversation = require('../models/conversationModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res, next) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.user.id;

    // Validate recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Create a unique conversation ID by sorting and concatenating user IDs
    const conversationId = [senderId, recipientId].sort().join('_');

    // Create and save the message
    const message = await Message.create({
      sender: senderId,
      recipient: recipientId,
      content,
      conversationId
    });

    // Find or create conversation
    const conversation = await Conversation.findOrCreateConversation(senderId, recipientId);

    // Update conversation with last message
    await conversation.updateLastMessage(message._id, content);

    // Increment unread count for recipient
    await conversation.incrementUnreadCount(recipientId);

    // Populate sender info
    const populatedMessage = await Message.findById(message._id).populate('sender', 'name avatar');

    res.status(201).json({
      success: true,
      data: populatedMessage
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get conversation between two users
// @route   GET /api/messages/conversation/:userId
// @access  Private
exports.getConversation = async (req, res, next) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    // Validate other user exists
    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get conversation
    const conversation = await Conversation.findOrCreateConversation(currentUserId, otherUserId);

    // Get messages
    const messages = await Message.getConversation(currentUserId, otherUserId);

    // Reset unread count for current user
    await conversation.resetUnreadCount(currentUserId);

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId: conversation._id,
        recipient: currentUserId,
        read: false
      },
      { read: true }
    );

    res.status(200).json({
      success: true,
      data: {
        conversation,
        messages
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all conversations for a user
// @route   GET /api/messages/conversations
// @access  Private
exports.getUserConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get all conversations
    const conversations = await Conversation.getUserConversations(userId);

    res.status(200).json({
      success: true,
      count: conversations.length,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark messages as read
// @route   PUT /api/messages/read/:conversationId
// @access  Private
exports.markMessagesAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;

    // Find conversation
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check if user is part of the conversation
    if (!conversation.participants.includes(userId)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this conversation'
      });
    }

    // Mark messages as read
    await Message.updateMany(
      {
        conversationId: conversation._id,
        recipient: userId,
        read: false
      },
      { read: true }
    );

    // Reset unread count
    await conversation.resetUnreadCount(userId);

    res.status(200).json({
      success: true,
      message: 'Messages marked as read'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a message
// @route   DELETE /api/messages/:id
// @access  Private
exports.deleteMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const messageId = req.params.id;

    // Find message
    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }

    // Check if user is the sender
    if (message.sender.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this message'
      });
    }

    // Delete message
    await message.remove();

    res.status(200).json({
      success: true,
      message: 'Message deleted'
    });
  } catch (error) {
    next(error);
  }
};