const User = require('../models/User');
const { AppError } = require('../utils/errorHandler');
const { validateUserInput, validateEmail, validateRole } = require('../utils/validators');
const logger = require('../utils/logger');

/**
 * Get all users with pagination, search, and filters
 */
const getAllUsers = async (query = {}, page = 1, limit = 10, currentUser = null) => {
  const skip = (page - 1) * limit;
  const searchFilter = {};

  // Text search
  if (query.search) {
    searchFilter.$or = [
      { firstName: { $regex: query.search, $options: 'i' } },
      { lastName: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  // Role filter
  if (query.role) {
    if (validateRole(query.role)) {
      searchFilter.role = query.role;
    }
  }

  // Status filter
  if (query.status) {
    searchFilter.status = query.status;
  }

  // Apply role-based restrictions
  if (currentUser && currentUser.role === 'manager') {
    // Manager can only see non-admin users
    searchFilter.role = { $ne: 'admin' };
  }

  try {
    const total = await User.countDocuments(searchFilter);
    const users = await User.find(searchFilter)
      .select('-password -refreshTokens')
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    throw new AppError('Failed to fetch users', 500);
  }
};

/**
 * Get user by ID with full details
 */
const getUserById = async (userId, requestingUser = null) => {
  const user = await User.findById(userId)
    .select('-password -refreshTokens')
    .populate('createdBy', 'firstName lastName email')
    .populate('updatedBy', 'firstName lastName email');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Authorization check: User can only view their own profile, Manager can view non-admins, Admin can view all
  if (
    requestingUser &&
    requestingUser._id.toString() !== userId &&
    requestingUser.role === 'user'
  ) {
    throw new AppError('You do not have permission to view this user', 403);
  }

  if (
    requestingUser &&
    requestingUser.role === 'manager' &&
    user.role === 'admin'
  ) {
    throw new AppError('You do not have permission to view this user', 403);
  }

  return user;
};

/**
 * Create new user (Admin only)
 */
const createUser = async (userData, createdBy) => {
  // Validate input
  const validation = validateUserInput(userData);
  if (!validation.isValid) {
    throw new AppError(JSON.stringify(validation.errors), 400);
  }

  // Check if email already exists
  const existingUser = await User.findOne({ email: userData.email.toLowerCase() });
  if (existingUser) {
    throw new AppError('User with this email already exists', 409);
  }

  // Prevent non-admin from creating admin users
  if (userData.role === 'admin' && createdBy.role !== 'admin') {
    throw new AppError('Only admins can create admin users', 403);
  }

  try {
    const newUser = new User({
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      email: userData.email.toLowerCase(),
      password: userData.password,
      role: userData.role || 'user',
      status: userData.status || 'active',
      createdBy: createdBy._id,
    });

    await newUser.save();

    logger.info(`User created: ${newUser.email} by ${createdBy.email}`);
    return newUser.toJSON();
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('User with this email already exists', 409);
    }
    throw error;
  }
};

/**
 * Update user (Admin/Manager/Self)
 */
const updateUser = async (userId, updateData, requestingUser) => {
  // Validate update data
  const validation = validateUserInput(updateData, true);
  if (!validation.isValid) {
    throw new AppError(JSON.stringify(validation.errors), 400);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Authorization checks
  const isOwnProfile = requestingUser._id.toString() === userId;
  const isAdmin = requestingUser.role === 'admin';
  const isManager = requestingUser.role === 'manager';

  // User can only update own profile (except role and status)
  if (!isOwnProfile && !isAdmin) {
    throw new AppError('You do not have permission to update this user', 403);
  }

  // Manager can only update non-admin users
  if (isManager && !isOwnProfile && user.role === 'admin') {
    throw new AppError('Managers cannot update admin users', 403);
  }

  // Regular users cannot change their role
  if (!isAdmin && updateData.role && updateData.role !== user.role) {
    throw new AppError('You do not have permission to change your role', 403);
  }

  // Only admin can change user status
  if (!isAdmin && updateData.status !== undefined) {
    throw new AppError('You do not have permission to change user status', 403);
  }

  // Manager cannot promote to admin or manager
  if (isManager && updateData.role && ['admin', 'manager'].includes(updateData.role)) {
    throw new AppError('Managers can only change user role to user', 403);
  }

  // Update allowed fields
  if (updateData.firstName) user.firstName = updateData.firstName.trim();
  if (updateData.lastName) user.lastName = updateData.lastName.trim();
  if (updateData.email && updateData.email !== user.email) {
    const existingUser = await User.findOne({ email: updateData.email.toLowerCase() });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }
    user.email = updateData.email.toLowerCase();
  }
  if (updateData.role && isAdmin) user.role = updateData.role;
  if (updateData.status !== undefined && isAdmin) user.status = updateData.status;

  user.updatedBy = requestingUser._id;

  try {
    await user.save();
    logger.info(`User updated: ${user.email} by ${requestingUser.email}`);
    return user.toJSON();
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('User with this email already exists', 409);
    }
    throw error;
  }
};

/**
 * Soft delete user (set status to inactive)
 */
const deleteUser = async (userId, requestingUser) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Only admin can delete users
  if (requestingUser.role !== 'admin') {
    throw new AppError('You do not have permission to delete users', 403);
  }

  // Cannot delete admin if not admin themselves (already checked above)
  // Prevent self-deletion
  if (requestingUser._id.toString() === userId) {
    throw new AppError('You cannot delete your own account', 400);
  }

  user.status = 'inactive';
  user.updatedBy = requestingUser._id;
  await user.save();

  logger.info(`User soft deleted: ${user.email} by ${requestingUser.email}`);
  return user.toJSON();
};

/**
 * Get user statistics (Admin only)
 */
const getUserStats = async () => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
        },
        inactiveUsers: {
          $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] },
        },
        admins: { $sum: { $cond: [{ $eq: ['$role', 'admin'] }, 1, 0] } },
        managers: { $sum: { $cond: [{ $eq: ['$role', 'manager'] }, 1, 0] } },
        users: { $sum: { $cond: [{ $eq: ['$role', 'user'] }, 1, 0] } },
      },
    },
  ]);

  return stats.length > 0
    ? stats[0]
    : {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        admins: 0,
        managers: 0,
        users: 0,
      };
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats,
};
