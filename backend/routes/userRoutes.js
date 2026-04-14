const express = require('express');
const {
  getAllUsersController,
  getUserByIdController,
  createUserController,
  updateUserController,
  deleteUserController,
  getUserStatsController,
} = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * All user routes require authentication
 */
router.use(authenticate);

/**
 * Public user routes (all authenticated users)
 */
router.get('/stats', authorize('admin'), getUserStatsController);
router.get('/:id', getUserByIdController);
router.put('/:id', updateUserController);

/**
 * Admin/Manager routes
 */
router.get('/', authorize('admin', 'manager'), getAllUsersController);
router.post('/', authorize('admin'), createUserController);

/**
 * Admin only routes
 */
router.delete('/:id', authorize('admin'), deleteUserController);

module.exports = router;
