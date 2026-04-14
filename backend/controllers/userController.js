const userService = require('../services/userService');
const { AppError } = require('../utils/errorHandler');
const logger = require('../utils/logger');

/**
 * GET /api/users
 * Get all users with pagination, search, and filters
 * Query params: page, limit, search, role, status
 */
const getAllUsersController = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, role, status } = req.query;

    const query = {};
    if (search) query.search = search;
    if (role) query.role = role;
    if (status) query.status = status;

    const result = await userService.getAllUsers(query, page, limit, req.user);

    res.status(200).json({
      success: true,
      message: 'Users retrieved successfully',
      data: result,
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Get all users error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
    });
  }
};

/**
 * GET /api/users/:id
 * Get user by ID with full details
 */
const getUserByIdController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await userService.getUserById(id, req.user);

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Get user by ID error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user',
    });
  }
};

/**
 * POST /api/users
 * Create new user (Admin only)
 */
const createUserController = async (req, res, next) => {
  try {
    const newUser = await userService.createUser(req.body, req.user);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Create user error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to create user',
    });
  }
};

/**
 * PUT /api/users/:id
 * Update user by ID (Admin/Manager/Self)
 */
const updateUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updatedUser = await userService.updateUser(id, req.body, req.user);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Update user error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to update user',
    });
  }
};

/**
 * DELETE /api/users/:id
 * Soft delete user by ID (Admin only)
 */
const deleteUserController = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedUser = await userService.deleteUser(id, req.user);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
      data: {
        user: deletedUser,
      },
    });
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }

    logger.error('Delete user error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user',
    });
  }
};

/**
 * GET /api/users/stats
 * Get user statistics (Admin only)
 */
const getUserStatsController = async (req, res, next) => {
  try {
    const stats = await userService.getUserStats();

    res.status(200).json({
      success: true,
      message: 'User statistics retrieved',
      data: {
        stats,
      },
    });
  } catch (error) {
    logger.error('Get user stats error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user statistics',
    });
  }
};

module.exports = {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
  getUserStatsController,
};
