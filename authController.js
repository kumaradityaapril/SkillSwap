const User = require('../models/userModel');
const crypto = require('crypto');
const { sendEmail, getVerificationEmailContent, getPasswordResetEmailContent } = require('../utils/emailService');
const asyncHandler = require('express-async-handler');

// @desc    Register user with email verification (temporarily disabled for development)
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Check if we should skip email verification (for development)
        const skipVerification = process.env.SKIP_EMAIL_VERIFICATION === 'true';

        let user;

        if (skipVerification) {
            // Create user without verification token but mark as verified
            user = await User.create({
                name,
                email,
                password,
                role: role || 'both',
                isVerified: true // Auto-verify for development
            });

            // Generate token
            const token = user.getSignedJwtToken();

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    isVerified: user.isVerified
                }
            });
        } else {
            // Generate verification token
            const verificationToken = crypto.randomBytes(20).toString('hex');

            // Hash token and set to verificationToken field
            const hashedToken = crypto
                .createHash('sha256')
                .update(verificationToken)
                .digest('hex');

            // Create user with verification token
            user = await User.create({
                name,
                email,
                password,
                role: role || 'both',
                verificationToken: hashedToken,
                verificationTokenExpire: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
            });

            // Create verification URL
            const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

            // Get email content
            const emailContent = getVerificationEmailContent(name, verificationUrl);

            // Send verification email
            await sendEmail({
                to: user.email,
                subject: emailContent.subject,
                html: emailContent.html,
                text: emailContent.text
            });

            res.status(201).json({
                success: true,
                message: 'User registered successfully. Please check your email to verify your account.'
            });
        }
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
    try {
        // Get hashed token
        const verificationToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        // Find user by verification token and check if token is still valid
        const user = await User.findOne({
            verificationToken,
            verificationTokenExpire: { $gt: Date.now() }
        });

        if (!user) {
            res.status(400);
            throw new Error('Invalid or expired verification token');
        }

        // Set user as verified and remove verification token
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpire = undefined;
        await user.save();

        // Generate JWT token for automatic login after verification
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        console.error('Email verification error:', error);
        throw error;
    }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            res.status(400);
            throw new Error('Please provide an email and password');
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            res.status(401);
            throw new Error('Invalid credentials');
        }

        // Generate token
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified
            }
        });
    } catch (error) {
        throw error;
    }
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        res.status(404);
        throw new Error('No user found with that email');
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Get email content
    const emailContent = getPasswordResetEmailContent(user.name, resetUrl);

    try {
        await sendEmail({
            to: user.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text
        });

        res.status(200).json({
            success: true,
            message: 'Password reset email sent'
        });
    } catch (err) {
        console.error('Email sending error:', err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        res.status(500);
        throw new Error('Email could not be sent');
    }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
    // Get hashed token
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    // Find user by reset token and check if token is still valid
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        res.status(400);
        throw new Error('Invalid token');
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Generate token for automatic login after password reset
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        data: token
    });
});

// @desc    Get logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('-password'); // Don't return password

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
const updateDetails = asyncHandler(async (req, res) => {
    const fieldsToUpdate = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role, // Allow updating role
    };

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Update user password
// @route   PUT /api/auth/updatepassword
// @access  Private
const updatePassword = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    if (!await user.matchPassword(req.body.currentPassword)) {
        res.status(401);
        throw new Error('Invalid credentials');
    }

    user.password = req.body.newPassword;
    await user.save();

    // Generate new token as password update invalidates previous one
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        data: token
    });
});

module.exports = {
    register,
    verifyEmail,
    login,
    forgotPassword,
    resetPassword,
    getMe,
    updateDetails,
    updatePassword
};