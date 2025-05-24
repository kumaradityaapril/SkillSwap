# Authentication Middleware

This directory contains middleware functions for authentication and authorization in the SkillSwap application.

## Overview

The authentication middleware provides the following functionality:

1. **Route Protection** - Verifies JWT tokens and attaches the authenticated user to the request object
2. **Role-Based Access Control** - Restricts access to routes based on user roles
3. **Email Verification Check** - Ensures users have verified their email before accessing certain routes

## Middleware Functions

### `protect`

This middleware verifies the JWT token from the request headers and attaches the user to the request object.

```javascript
// Example usage in routes
router.get("/profile", protect, profileController);
```

### `authorize(...roles)`

This middleware checks if the authenticated user has the required role to access a route.

```javascript
// Example usage in routes - only admins can access
router.delete("/users/:id", protect, authorize("admin"), deleteUserController);

// Example usage for multiple roles
router.get(
  "/dashboard",
  protect,
  authorize("mentor", "admin"),
  dashboardController
);
```

### `isVerified`

This middleware checks if the user has verified their email address.

```javascript
// Example usage in routes
router.post("/create-session", protect, isVerified, createSessionController);
```

## Implementation Details

- Uses JWT for stateless authentication
- Extracts token from the Authorization header (Bearer token)
- Verifies token using the JWT_SECRET from environment variables
- Handles various error scenarios with appropriate status codes
- Supports role-based access control for different user types (learner, mentor, both, admin)

## Security Considerations

- Tokens are verified using the JWT_SECRET environment variable
- Protected routes return 401 Unauthorized for invalid or missing tokens
- Role-based routes return 403 Forbidden for insufficient permissions
- Email verification is required for sensitive operations
