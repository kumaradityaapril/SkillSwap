const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

// Protect routes - verify token and attach user to request
const protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log('Protect middleware: Checking for token');

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extract token from Bearer token
    token = req.headers.authorization.split(' ')[1];
    console.log('Protect middleware: Token found:', token);
  }

  // Check if token exists
  if (!token) {
    console.log('Protect middleware: No token found');
    res.status(401);
    throw new Error('Not authorized to access this route');
  }

  try {
    console.log('Protect middleware: Verifying token');
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Protect middleware: Token verified, decoded ID:', decoded.id);

    // Attach user to request object
    req.user = await User.findById(decoded.id).select('-password');
    console.log('Protect middleware: User found:', req.user);

    if (!req.user) {
      console.log('Protect middleware: User not found after verification');
      res.status(401);
      throw new Error('User not found with this ID');
    }

    next();
  } catch (error) {
    console.error('Protect middleware: Error during token verification or user lookup:', error);
    res.status(401);
    throw new Error('Not authorized to access this route');
  }
});

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error('User not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`User role ${req.user.role} is not authorized to access this route`);
    }

    next();
  };
};

// Check if user is verified
const isVerified = (req, res, next) => {
  // Skip verification check if SKIP_EMAIL_VERIFICATION is true
  if (process.env.SKIP_EMAIL_VERIFICATION === 'true') {
    return next();
  }

  if (!req.user || !req.user.isVerified) {
    res.status(403);
    throw new Error('Please verify your email to access this route');
  }

  next();
};

module.exports = {
  protect,
  authorize,
  isVerified,
};