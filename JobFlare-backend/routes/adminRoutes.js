import express from 'express';
import { body } from 'express-validator';
import {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  getUserDetails,
  updateUserVerification,
  searchUsers,
  initializeAdmin,
  checkUserDevice,
  updateHadRun
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @route   POST /api/admin/initialize
// @desc    Initialize default admin account (run once)
// @access  Public
router.post('/initialize', initializeAdmin);

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
], adminLogin);

// Protected routes (require authentication)
router.use(protect);

// @route   GET /api/admin/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/dashboard/stats', getDashboardStats);

// @route   GET /api/admin/users
// @desc    Get all users with filters
// @access  Private (Admin only)
router.get('/users', getAllUsers);

// @route   GET /api/admin/users/search
// @desc    Search users
// @access  Private (Admin only)
router.get('/users/search', searchUsers);

// @route   GET /api/admin/users/:userId
// @desc    Get user details
// @access  Private (Admin only)
router.get('/users/:userId', getUserDetails);

// @route   PUT /api/admin/users/:userId/verification/:stepNumber
// @desc    Update user verification step status
// @access  Private (Admin only)
router.put('/users/:userId/verification/:stepNumber', updateUserVerification);

// @route   POST /api/admin/users/:userId/check-device
// @desc    Check if user's device has hadRun = true
// @access  Private (Admin only)
router.post('/users/:userId/check-device', checkUserDevice);

// @route   PUT /api/admin/users/:userId/hadrun
// @desc    Update hadRun status for a user
// @access  Private (Admin only)
router.put('/users/:userId/hadrun', updateHadRun);

export default router;
