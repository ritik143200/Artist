const User = require('../models/User');
const Artist = require('../models/Artist');
const Notification = require('../models/Notification');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      try {
        await Notification.create({
          type: 'user',
          message: `New user registration: ${user.name}`,
          relatedId: user._id
        });
      } catch (err) {
        console.error('Failed to create notification for new user:', err);
      }

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
        message: 'User registered successfully'
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user in User collection first
    let user = await User.findOne({ email });
    let userType = 'user';

    // If not found in User collection, check Artist collection
    if (!user) {
      user = await Artist.findOne({ email });
      userType = 'artist';
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check for password
    let isMatch;
    if (userType === 'user') {
      isMatch = await user.comparePassword(password);
    } else {
      // For artists, compare with bcrypt directly
      isMatch = await bcrypt.compare(password, user.password);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      name: user.firstName ? `${user.firstName} ${user.lastName}` : user.name,
      email: user.email,
      role: user.role || 'user',
      token,
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const sendEmail = require('../utils/emailService');

// @desc    Forgot Password - Verify email existence and send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check for user/artist in database
    let userRecord = await User.findOne({ email });
    if (!userRecord) {
      userRecord = await Artist.findOne({ email });
    }

    // SECURITY: Always return the same message to prevent email enumeration
    const genericMessage = 'If this email exists, a password reset link has been sent to your inbox.';

    if (!userRecord) {
      // Just log for server-side visibility, but send generic success to client
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({ message: genericMessage });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');

    // Hash token for storage
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token and 30m expiration
    userRecord.resetPasswordToken = hashedToken;
    userRecord.resetPasswordExpires = Date.now() + 30 * 60 * 1000;

    await userRecord.save();

    // Construct reset URL with query parameter
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const emailContent = `You requested a password reset. Please click on this link or paste it into your browser: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: userRecord.email,
        subject: 'Password Reset Request',
        message: emailContent,
        resetUrl,
      });

      res.status(200).json({ message: genericMessage });
    } catch (err) {
      console.error('Email could not be sent:', err);
      // Clean up token if email fails
      userRecord.resetPasswordToken = undefined;
      userRecord.resetPasswordExpires = undefined;
      await userRecord.save();

      // Even on local error, we might want to return the generic message to the client
      // or a server error if it's clearly an infrastructure issue. 
      // For now, return the generic success to keep behavior consistent.
      return res.status(200).json({ message: genericMessage });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'An error occurred. Please try again later.' });
  }
};

// @desc    Reset Password - Verify token and update password
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    // Hash the token provided in the URL to match the one in the database
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    let userType = 'user';
    // Find user/artist with matching token and valid expiry
    let userRecord = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!userRecord) {
      userRecord = await Artist.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpires: { $gt: Date.now() }
      });
      userType = 'artist';
    }

    if (!userRecord) {
      return res.status(400).json({ message: 'Invalid or expired password reset token' });
    }

    // Set new password
    if (userType === 'artist') {
      const salt = await bcrypt.genSalt(10);
      userRecord.password = await bcrypt.hash(password, salt);
    } else {
      userRecord.password = password; // User schema has pre-save hook
    }
    userRecord.resetPasswordToken = undefined;
    userRecord.resetPasswordExpires = undefined;

    await userRecord.save();

    res.status(200).json({ message: 'Password updated successfully! You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'An error occurred during password reset. Please try again later.' });
  }
};

// @desc    Change Password - Verify old password and update to new password
// @route   POST /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'New password must be at least 6 characters' });
    }

    // req.user logic depends on if we have protect middleware, but authRoute is public. 
    // Wait, let's look at `protect` middleware: we will use `protect` for this route.
    const userId = req.user._id;
    let userRecord = await User.findById(userId);
    let userType = 'user';

    if (!userRecord) {
      userRecord = await Artist.findById(userId);
      userType = 'artist';
    }

    if (!userRecord) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check for password
    let isMatch;
    if (userType === 'user') {
      isMatch = await userRecord.comparePassword(currentPassword);
    } else {
      isMatch = await bcrypt.compare(currentPassword, userRecord.password);
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    // Update password
    if (userType === 'artist') {
      const salt = await bcrypt.genSalt(10);
      userRecord.password = await bcrypt.hash(newPassword, salt);
    } else {
      userRecord.password = newPassword; // User schema has pre-save hook
    }

    await userRecord.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'An error occurred during password change. Please try again later.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  changePassword
};
