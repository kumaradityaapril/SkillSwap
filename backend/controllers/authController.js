const User = require('../models/userModel');
const crypto = require('crypto');
const { sendEmail, getVerificationEmailContent, getPasswordResetEmailContent } = require('../utils/emailService');

// @desc    Register user with email verification (temporarily disabled for development)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
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

            return res.status(201).json({
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
                email: user.email,
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
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res) => {
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
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired verification token'
            });
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
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
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
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with that email'
            });
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
                email: user.email,
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

            return res.status(500).json({
                success: false,
                message: 'Email could not be sent'
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
exports.resetPassword = async (req, res) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        // Generate JWT token for automatic login after password reset
        const token = user.getSignedJwtToken();

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// @desc    Resend verification email
// @route   POST /api/auth/resend-verification
// @access  Public
exports.resendVerification = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with that email'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'This account is already verified'
            });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to verificationToken field
        const hashedToken = crypto
            .createHash('sha256')
            .update(verificationToken)
            .digest('hex');

        // Update user with new verification token
        user.verificationToken = hashedToken;
        user.verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        // Create verification URL
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

        // Get email content
        const emailContent = getVerificationEmailContent(user.name, verificationUrl);

        // Send verification email
        await sendEmail({
            email: user.email,
            subject: emailContent.subject,
            html: emailContent.html,
            text: emailContent.text
        });

        res.status(200).json({
            success: true,
            message: 'Verification email resent successfully'
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};