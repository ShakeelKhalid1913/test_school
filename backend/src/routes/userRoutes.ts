import express from 'express';
import { body, param } from 'express-validator';
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getUserTestHistory
} from '../controllers/userController';
import { asyncHandler } from '../middleware/errorHandler';
import { authMiddleware, adminOnly, supervisorOrAdmin } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @route   GET /api/users/profile
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/profile', authMiddleware, asyncHandler(getUserProfile));

/**
 * @route   PUT /api/users/profile
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/profile', [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address')
], authMiddleware, asyncHandler(updateUserProfile));

/**
 * @route   GET /api/users/test-history
 * @desc    Get current user's test history
 * @access  Private
 */
router.get('/test-history', authMiddleware, asyncHandler(getUserTestHistory));

/**
 * @route   GET /api/users
 * @desc    Get all users (Admin/Supervisor only)
 * @access  Private (Admin/Supervisor)
 */
router.get('/', supervisorOrAdmin, asyncHandler(getAllUsers));

/**
 * @route   GET /api/users/:id
 * @desc    Get user by ID (Admin/Supervisor only)
 * @access  Private (Admin/Supervisor)
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid user ID')
], supervisorOrAdmin, asyncHandler(getUserById));

/**
 * @route   PUT /api/users/:id/role
 * @desc    Update user role (Admin only)
 * @access  Private (Admin)
 */
router.put('/:id/role', [
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('role')
    .isIn(['admin', 'student', 'supervisor'])
    .withMessage('Role must be admin, student, or supervisor')
], adminOnly, asyncHandler(updateUserRole));

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete user (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid user ID')
], adminOnly, asyncHandler(deleteUser));

export default router;
