const nodemailer = require('nodemailer');

/**
 * Email service for sending emails using Nodemailer
 */
const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    // Define email options
    const mailOptions = {
        from: `${process.env.EMAIL_FROM}`,
        to: options.email,
        subject: options.subject,
        html: options.html,
        text: options.text
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    return info;
};

/**
 * Generate verification email content
 */
const getVerificationEmailContent = (name, verificationUrl) => {
    return {
        subject: 'SkillSwap - Verify Your Email',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a6ee0;">Welcome to SkillSwap!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering with SkillSwap. To complete your registration and access all features, please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Verify Email</a>
        </div>
        <p>If the button doesn't work, you can also click on the link below or copy it to your browser:</p>
        <p><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p>This verification link will expire in 24 hours.</p>
        <p>If you didn't create an account on SkillSwap, please ignore this email.</p>
        <p>Best regards,<br>The SkillSwap Team</p>
      </div>
    `,
        text: `Welcome to SkillSwap!\n\nHi ${name},\n\nThank you for registering with SkillSwap. To complete your registration, please verify your email address by clicking on the following link:\n\n${verificationUrl}\n\nThis verification link will expire in 24 hours.\n\nIf you didn't create an account on SkillSwap, please ignore this email.\n\nBest regards,\nThe SkillSwap Team`
    };
};

/**
 * Generate password reset email content
 */
const getPasswordResetEmailContent = (name, resetUrl) => {
    return {
        subject: 'SkillSwap - Password Reset',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a6ee0;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>You requested a password reset for your SkillSwap account. Please click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #4a6ee0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If the button doesn't work, you can also click on the link below or copy it to your browser:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This password reset link will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email and your password will remain unchanged.</p>
        <p>Best regards,<br>The SkillSwap Team</p>
      </div>
    `,
        text: `Password Reset Request\n\nHi ${name},\n\nYou requested a password reset for your SkillSwap account. Please use the following link to set a new password:\n\n${resetUrl}\n\nThis password reset link will expire in 10 minutes.\n\nIf you didn't request a password reset, please ignore this email and your password will remain unchanged.\n\nBest regards,\nThe SkillSwap Team`
    };
};

module.exports = {
    sendEmail,
    getVerificationEmailContent,
    getPasswordResetEmailContent
};