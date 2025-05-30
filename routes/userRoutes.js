const express = require('express');
const router = express.Router();

console.log('User routes loaded.'); // Temporary log

// Import controllers (placeholder for demonstration)
// In a real implementation, you would create these controller files
const {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  getUserSkills,
  getUserSessions,
  getUserStats,
  bookmarkSkill,
  removeBookmarkedSkill
} = require('../controllers/userController');

// Import authentication middleware
const { protect, authorize, isVerified } = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (authentication required)
router.get('/me', protect, getMe);
router.put('/profile', protect, isVerified, updateProfile);

// Routes for bookmarking skills
router.post('/me/bookmark', protect, bookmarkSkill);
router.delete('/me/bookmark/:skillId', protect, removeBookmarkedSkill);

// New protected routes for fetching user-specific data
router.get('/me/skills', protect, getUserSkills);
router.get('/me/sessions', protect, getUserSessions);
router.get('/me/stats', protect, getUserStats);

// Admin only routes
router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;