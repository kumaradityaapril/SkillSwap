const express = require('express');
const router = express.Router();

// Import controllers
const {
  getAllReviews,
  getSkillReviews,
  getUserReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');

// Import authentication middleware
const { protect, authorize, isVerified } = require('../middleware/auth');

// Public routes
router.get('/', getAllReviews);
router.get('/skill/:skillId', getSkillReviews);
router.get('/user/:userId', getUserReviews);

// Protected routes
router.get('/me', protect, getMyReviews);
router.post('/', protect, isVerified, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;