# Authentication System Tests

This directory contains tests for the SkillTrae authentication system. The tests verify the functionality of JWT-based authentication, role-based authorization, and email verification.

## Test File: `auth.test.js`

This file contains a comprehensive test suite for the authentication system, including:

- User registration
- User login
- Protected route access
- Unauthorized access handling
- Role-based authorization
- Admin access to restricted routes
- Email verification bypass (controlled by SKIP_EMAIL_VERIFICATION environment variable)

## Prerequisites

1. The SkillTrae backend server must be running on http://localhost:5002
2. MongoDB must be connected and running
3. Required environment variables must be set:
   - JWT_SECRET
   - SKIP_EMAIL_VERIFICATION (set to 'true' to bypass email verification)

## Running the Tests

To run the authentication tests:

```bash
# Install axios if not already installed
npm install axios

# Run the test script
node tests/auth.test.js
```

## Test Results

The test script will output detailed results for each test case to the console. A successful test run will show:

- Successful user registration (or login if user already exists)
- Successful access to protected routes with valid authentication
- Rejection of unauthorized access attempts
- Proper role-based access control
- Verification of email verification bypass functionality

## Notes

- The admin login test will fail if no admin user exists in the database
- If SKIP_EMAIL_VERIFICATION is set to 'false', some tests requiring verified status may fail
- The test creates a test user with the email 'testuser@example.com' - you may want to delete this user after testing

## Authentication System Overview

The SkillTrae authentication system uses:

- JWT (JSON Web Tokens) for stateless authentication
- Middleware for protecting routes (`protect` middleware)
- Role-based authorization (`authorize` middleware)
- Email verification (can be bypassed with SKIP_EMAIL_VERIFICATION)

The system is implemented across several files:

- `controllers/authController.js` - Authentication logic
- `middleware/auth.js` - Authentication middleware
- `models/userModel.js` - User model with password hashing and token generation
- `routes/authRoutes.js` - Authentication routes
