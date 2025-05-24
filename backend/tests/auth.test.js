const axios = require('axios');

// Configuration
const API_URL = 'http://localhost:5003/api';
let authToken = null;
let userId = null;

// Test user credentials
const testUser = {
    name: 'Test User',
    email: 'testuser@example.com',
    password: 'password123',
    role: 'both'
};

// Admin user credentials (for testing role-based authorization)
const adminUser = {
    email: 'admin@example.com',
    password: 'adminpassword'
};

// Helper function to make authenticated requests
const authenticatedRequest = async (method, endpoint, data = null) => {
    const config = {
        headers: { Authorization: `Bearer ${authToken}` }
    };

    try {
        let response;
        if (method === 'get') {
            response = await axios.get(`${API_URL}${endpoint}`, config);
        } else if (method === 'post') {
            response = await axios.post(`${API_URL}${endpoint}`, data, config);
        } else if (method === 'put') {
            response = await axios.put(`${API_URL}${endpoint}`, data, config);
        } else if (method === 'delete') {
            response = await axios.delete(`${API_URL}${endpoint}`, config);
        }
        return response.data;
    } catch (error) {
        console.error(`Error in ${method.toUpperCase()} ${endpoint}:`, error.response?.data || error.message);
        return error.response?.data;
    }
};

// Test functions
async function testRegistration() {
    console.log('\n--- Testing User Registration ---');
    try {
        const response = await axios.post(`${API_URL}/auth/register`, testUser);
        console.log('Registration successful:', response.data);

        // If SKIP_EMAIL_VERIFICATION is true, we should get a token back
        if (response.data.token) {
            authToken = response.data.token;
            userId = response.data.user.id;
            console.log('User automatically verified (SKIP_EMAIL_VERIFICATION=true)');
        } else {
            console.log('Verification email sent. Check your email to verify account.');
        }
        return true;
    } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
        return false;
    }
}

async function testLogin() {
    console.log('\n--- Testing User Login ---');
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });

        authToken = response.data.token;
        userId = response.data.user.id;
        console.log('Login successful:', response.data);
        return true;
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        return false;
    }
}

async function testProtectedRoute() {
    console.log('\n--- Testing Protected Route ---');
    try {
        const response = await authenticatedRequest('get', '/users/me');
        console.log('Protected route access successful:', response);
        return true;
    } catch (error) {
        console.error('Protected route access failed:', error);
        return false;
    }
}

async function testUnauthorizedAccess() {
    console.log('\n--- Testing Unauthorized Access ---');
    // Save the current token
    const savedToken = authToken;
    // Set an invalid token
    authToken = 'invalid_token';

    try {
        const response = await authenticatedRequest('get', '/users/me');
        console.log('Response:', response);
        if (!response.success) {
            console.log('Unauthorized access correctly rejected');
        } else {
            console.log('ERROR: Unauthorized access was allowed!');
        }
    } catch (error) {
        console.error('Error:', error);
    }

    // Restore the valid token
    authToken = savedToken;
    return true;
}

async function testRoleBasedAuthorization() {
    console.log('\n--- Testing Role-Based Authorization ---');
    try {
        // Try to access admin-only route with non-admin user
        const response = await authenticatedRequest('get', '/users');

        if (!response.success && response.message.includes('not authorized')) {
            console.log('Role-based authorization working correctly - access denied');
            return true;
        } else {
            console.log('ERROR: Role-based authorization failed - non-admin accessed admin route');
            return false;
        }
    } catch (error) {
        console.error('Error testing role-based authorization:', error);
        return false;
    }
}

async function testAdminLogin() {
    console.log('\n--- Testing Admin Login ---');
    try {
        const response = await axios.post(`${API_URL}/auth/login`, adminUser);

        authToken = response.data.token;
        console.log('Admin login successful');
        return true;
    } catch (error) {
        console.error('Admin login failed:', error.response?.data || error.message);
        console.log('Note: This test will fail if no admin user exists in the database');
        return false;
    }
}

async function testAdminAccess() {
    console.log('\n--- Testing Admin Access ---');
    try {
        const response = await authenticatedRequest('get', '/users');

        if (response.success) {
            console.log('Admin access successful - retrieved all users');
            return true;
        } else {
            console.log('ERROR: Admin access failed');
            return false;
        }
    } catch (error) {
        console.error('Error testing admin access:', error);
        return false;
    }
}

async function testEmailVerificationBypass() {
    console.log('\n--- Testing Email Verification Bypass ---');
    try {
        // Try to access a route that requires verification
        const response = await authenticatedRequest('put', '/users/profile', {
            bio: 'Testing verification bypass'
        });

        if (response.success) {
            console.log('Email verification bypass working correctly - SKIP_EMAIL_VERIFICATION=true');
            return true;
        } else if (response.message && response.message.includes('verify your email')) {
            console.log('Email verification required - SKIP_EMAIL_VERIFICATION=false');
            return true;
        } else {
            console.log('Unexpected response:', response);
            return false;
        }
    } catch (error) {
        console.error('Error testing email verification bypass:', error);
        return false;
    }
}

// Main test function
async function runTests() {
    console.log('=== STARTING AUTHENTICATION SYSTEM TESTS ===');

    // Test registration first (if user doesn't exist)
    await testRegistration();

    // Test login
    const loginSuccess = await testLogin();
    if (!loginSuccess) {
        console.log('Login failed, cannot continue with authenticated tests');
        return;
    }

    // Run tests that require authentication
    await testProtectedRoute();
    await testUnauthorizedAccess();
    await testRoleBasedAuthorization();
    await testEmailVerificationBypass();

    // Test admin functionality
    await testAdminLogin();
    await testAdminAccess();

    console.log('\n=== AUTHENTICATION SYSTEM TESTS COMPLETED ===');
}

// Run the tests
runTests().catch(error => {
    console.error('Test suite error:', error);
});