const { AppError } = require('../utils/errorHandler');
const { verifyAccessToken, verifyRefreshToken, generateAccessToken } = require('../utils/jwtUtils');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Middleware to authenticate user via JWT token
 * Verifies access token and attaches user info to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No authorization token provided', 401);
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const decoded = verifyAccessToken(token);
    if (!decoded) {
      throw new AppError('Invalid or expired token', 401);
    }

    // Get user from database
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (user.status === 'inactive') {
      throw new AppError('User account is inactive', 403);
    }

    // Attach user to request
    req.user = user;
    req.token = token;

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Authentication error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};

/**
 * Middleware to authorize based on user role
 * Pass allowed roles as parameters
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(
        `User ${req.user.email} with role ${req.user.role} attempted unauthorized access to ${req.path}`
      );
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions to access this resource',
      });
    }

    next();
  };
};

/**
 * Middleware to refresh access token if refresh token is valid
 * Used when access token is expired
 */
const refreshAccessToken = (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    // Generate new access token
    const user = req.user || { userId: decoded.userId };
    const newAccessToken = generateAccessToken(user.userId, user.email, user.role);

    res.status(200).json({
      success: true,
      message: 'Access token refreshed',
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Token refresh error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed',
    });
  }
};

module.exports = {
  authenticate,
  authorize,
  refreshAccessToken,
};
