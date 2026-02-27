const nodemailer = require('nodemailer');

/**
 * Send an email using Nodemailer
 * @param {Object} options - Email options (email, subject, message)
 */
const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    // Define email options
    const mailOptions = {
        from: `Indori Artist <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #6366f1; text-align: center;">Password Reset Request</h2>
        <p>You are receiving this email because you (or someone else) requested a password reset for your account.</p>
        <p>Please click on the following link, or paste it into your browser to complete the process within 30 minutes of receiving it:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${options.resetUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p style="word-break: break-all; color: #666; font-size: 14px;">${options.resetUrl}</p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 Indori Artist. All rights reserved.</p>
      </div>
    `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
