const express = require('express');
const router = express.Router();

// Import controllers
const {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerification
} = require('../controllers/authController');

// Public routes (no authentication required)
router.post('/register', register);
router.post('/login', login);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
router.post('/resend-verification', resendVerification);

module.exports = router;