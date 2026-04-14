const authService = require('../services/authService');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * POST /api/auth/login
 * Login user and return access token and refresh token
 */
const loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const result = await authService.login(email, password);

    // Set refresh token in httpOnly cookie (optional but recommended)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      },
    });

    logger.info(`User logged in: ${email}`);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Login failed',
    });
  }
};

/**
 * POST /api/auth/logout
 * Logout user and remove refresh token
 */
const logoutController = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.user._id;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    await authService.logout(userId, refreshToken);

    // Clear refresh token cookie
    res.clearCookie('refreshToken');

    res.status(200).json({
      success: true,
      message: 'Logout successful',
    });

    logger.info(`User logged out: ${req.user.email}`);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Logout error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
    });
  }
};

/**
 * POST /api/auth/register
 * Register new user (Admin only in practice, but service allows creation)
 */
const registerController = async (req, res, next) => {
  try {
    const userData = req.body;

    // Check if user is admin
    if (req.user && req.user.role !== 'admin') {
      throw new AppError('Only admins can create new users', 403);
    }

    const newUser = await authService.register(userData, req.user._id);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: newUser,
      },
    });

    logger.info(`New user registered: ${newUser.email}`);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Registration error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
    });
  }
};

/**
 * POST /api/auth/change-password
 * Change current user password
 */
const changePasswordController = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!oldPassword || !newPassword) {
      throw new AppError('Old password and new password are required', 400);
    }

    await authService.changePassword(userId, oldPassword, newPassword);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });

    logger.info(`Password changed for user: ${req.user.email}`);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Change password error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Password change failed',
    });
  }
};

/**
 * PUT /api/auth/me
 * Update current user profile information
 */
const updateMeController = async (req, res, next) => {
  try {
    const { firstName, lastName, email } = req.body;

    const updatedUser = await authService.updateProfile(req.user._id, {
      firstName,
      lastName,
      email,
    });

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser,
      },
    });

    logger.info(`Profile updated for user: ${updatedUser.email}`);
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Update profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
    });
  }
};

/**
 * GET /api/auth/me
 * Get current user profile
 */
const getMeController = async (req, res, next) => {
  try {
    const user = req.user.toJSON();

    res.status(200).json({
      success: true,
      message: 'User profile retrieved',
      data: {
        user,
      },
    });
  } catch (error) {
    logger.error('Get profile error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile',
    });
  }
};

module.exports = {
  loginController,
  logoutController,
  registerController,
  changePasswordController,
  updateMeController,
  getMeController,
};
