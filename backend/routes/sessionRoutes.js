const express = require('express');
const router = express.Router();

// Import controllers
const {
  getAllSessions,
  getSessionById,
  getMySessions,
  createSession,
  updateSessionStatus,
  deleteSession
} = require('../controllers/sessionController');

// Import authentication middleware
const { protect, authorize, isVerified } = require('../middleware/auth');

// Admin routes
router.get('/', protect, authorize('admin'), getAllSessions);
router.delete('/:id', protect, authorize('admin'), deleteSession);

// User routes
router.get('/me', protect, getMySessions);
router.get('/:id', protect, getSessionById);
router.post('/', protect, isVerified, createSession);
router.put('/:id', protect, updateSessionStatus);

module.exports = router;