# Email Service Configuration

## Overview

This directory contains the email service utility for the SkillSwap application. The email service is built using Nodemailer and is used for:

- Sending verification emails during user registration
- Sending password reset emails
- Other notification emails

## Configuration

To use the email service, you need to configure the following environment variables in the `.env` file:

```
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com
```

### Gmail Configuration

If you're using Gmail as your email service:

1. Go to your Google Account settings: https://myaccount.google.com/
2. Enable 2-Step Verification if you haven't already
3. Create an App Password:
   - Go to Security → App passwords
   - Select "Mail" as the app and your device
   - Click "Generate"
4. Use the generated 16-character password as your `EMAIL_PASSWORD` in the `.env` file

## Usage

The email service provides the following functions:

### `sendEmail(options)`

Sends an email with the specified options.

```javascript
const { sendEmail } = require("../utils/emailService");

await sendEmail({
  email: "recipient@example.com",
  subject: "Email Subject",
  html: "<p>HTML content</p>",
  text: "Plain text content",
});
```

### `getVerificationEmailContent(name, verificationUrl)`

Generates content for verification emails.

```javascript
const { getVerificationEmailContent } = require("../utils/emailService");

const emailContent = getVerificationEmailContent(
  "User Name",
  "https://example.com/verify/token"
);
// Returns an object with subject, html, and text properties
```

### `getPasswordResetEmailContent(name, resetUrl)`

Generates content for password reset emails.

```javascript
const { getPasswordResetEmailContent } = require("../utils/emailService");

const emailContent = getPasswordResetEmailContent(
  "User Name",
  "https://example.com/reset/token"
);
// Returns an object with subject, html, and text properties
```

## Customization

You can customize the email templates by modifying the HTML and text content in the `getVerificationEmailContent` and `getPasswordResetEmailContent` functions in `emailService.js`.
