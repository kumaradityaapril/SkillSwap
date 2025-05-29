const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { protect } = require('../middleware/auth');

console.log('Loading sessionRoutes.js'); // Add log to confirm file loading

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
const { authorize, isVerified } = require('../middleware/auth');

// Admin routes
router.get('/', protect, authorize('admin'), getAllSessions);
router.delete('/:id', protect, authorize('admin'), deleteSession);

// User routes

// Get my sessions (define before /:id)
router.get('/me', protect, getMySessions);

// Get available time slots
router.get('/available-slots', protect, sessionController.getAvailableSlots);

// Get session requests (define before /:id)
router.get('/requests', protect, sessionController.getSessionRequests);

// Respond to a session request
router.put('/:sessionId/respond', protect, sessionController.respondToSessionRequest);

// Get session by ID (define after /me, /available-slots, /requests)
router.get('/:id', protect, getSessionById);

// Create new session request (using the root / api/sessions route for creation)
router.post('/', protect, isVerified, createSession);

// Update session status (using the root / api/sessions route for updates by ID)
router.put('/:id', protect, updateSessionStatus);

module.exports = router;