const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../utils/jwtUtils');
const { validateEmail, validatePassword } = require('../utils/validators');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * Login user with email and password
 * Returns access and refresh tokens
 */
const login = async (email, password) => {
  // Validate input
  if (!email || !validateEmail(email)) {
    throw new AppError('Valid email is required', 400);
  }

  if (!password) {
    throw new AppError('Password is required', 400);
  }

  // Find user by email (include password field)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  // Check if user is active
  if (user.status === 'inactive') {
    throw new AppError('Your account is inactive. Please contact administrator.', 403);
  }

  // Compare passwords
  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new AppError('Invalid credentials', 401);
  }

  // Generate tokens
  const accessToken = generateAccessToken(user._id, user.email, user.role);
  const refreshToken = generateRefreshToken(user._id);

  // Store refresh token in database
  user.refreshTokens.push({ token: refreshToken });
  user.lastLogin = new Date();
  await user.save();

  // Return user data and tokens
  return {
    user: user.toJSON(),
    accessToken,
    refreshToken,
  };
};

/**
 * Logout user by removing refresh token from database
 */
const logout = async (userId, refreshToken) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Remove refresh token from database
  user.refreshTokens = user.refreshTokens.filter((rt) => rt.token !== refreshToken);
  await user.save();

  logger.info(`User ${user.email} logged out`);
  return true;
};

/**
 * Register new user (typically admin-only operation)
 */
const register = async (userData, createdBy = null) => {
  const { firstName, lastName, email, password, role } = userData;

  // Validate input
  if (!firstName || !lastName || !email || !password) {
    throw new AppError('All required fields must be provided', 400);
  }

  if (!validateEmail(email)) {
    throw new AppError('Valid email is required', 400);
  }

  if (!validatePassword(password)) {
    throw new AppError(
      'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
      400
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  // Create new user
  const newUser = new User({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: email.toLowerCase(),
    password,
    role: role || 'user',
    createdBy,
  });

  await newUser.save();

  logger.info(`New user created: ${newUser.email} by ${createdBy || 'system'}`);
  return newUser.toJSON();
};

/**
 * Change user password
 */
const changePassword = async (userId, oldPassword, newPassword) => {
  if (!oldPassword || !newPassword) {
    throw new AppError('Old and new password are required', 400);
  }

  if (!validatePassword(newPassword)) {
    throw new AppError(
      'New password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
      400
    );
  }

  // Get user with password field
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Verify old password
  const isPasswordValid = await user.comparePassword(oldPassword);
  if (!isPasswordValid) {
    throw new AppError('Current password is incorrect', 401);
  }

  // Update password
  user.password = newPassword;
  user.updatedBy = userId;
  await user.save();

  // Clear all refresh tokens (force re-login on all devices)
  user.refreshTokens = [];
  await user.save();

  logger.info(`User ${user.email} changed password`);
  return true;
};

/**
 * Update the authenticated user's profile
 */
const updateProfile = async (userId, profileData) => {
  const { firstName, lastName, email } = profileData;

  if (firstName !== undefined && (!firstName || firstName.trim().length < 2)) {
    throw new AppError('First name must be at least 2 characters', 400);
  }

  if (lastName !== undefined && (!lastName || lastName.trim().length < 2)) {
    throw new AppError('Last name must be at least 2 characters', 400);
  }

  if (email !== undefined && !validateEmail(email)) {
    throw new AppError('Valid email is required', 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (firstName !== undefined) {
    user.firstName = firstName.trim();
  }

  if (lastName !== undefined) {
    user.lastName = lastName.trim();
  }

  if (email !== undefined && email.toLowerCase() !== user.email) {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser && existingUser._id.toString() !== userId.toString()) {
      throw new AppError('User with this email already exists', 409);
    }

    user.email = email.toLowerCase();
  }

  user.updatedBy = userId;
  await user.save();

  logger.info(`User ${user.email} updated their profile`);
  return user.toJSON();
};

module.exports = {
  login,
  logout,
  register,
  changePassword,
  updateProfile,
};
