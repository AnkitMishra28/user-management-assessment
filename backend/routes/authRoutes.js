const express = require('express');
const {
  loginController,
  logoutController,
  registerController,
  changePasswordController,
  updateMeController,
  getMeController,
} = require('../controllers/authController');
const { authenticate, refreshAccessToken } = require('../middleware/auth');

const router = express.Router();

/**
 * Public routes
 */
router.post('/login', loginController);
router.post('/register', registerController);
router.post('/refresh-token', refreshAccessToken);

/**
 * Protected routes (require authentication)
 */
router.post('/logout', authenticate, logoutController);
router.post('/change-password', authenticate, changePasswordController);
router.put('/me', authenticate, updateMeController);
router.get('/me', authenticate, getMeController);

module.exports = router;
