import express from 'express';
import { body, param, query } from 'express-validator';
import {
  startTest,
  submitAnswer,
  submitTest,
  getTestSession,
  getTestHistory,
  getAvailableTests
} from '../controllers/testController';
import { asyncHandler } from '../middleware/errorHandler';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @route   GET /api/tests/available
 * @desc    Get available tests for current user
 * @access  Private
 */
router.get('/available', authMiddleware, asyncHandler(getAvailableTests));

/**
 * @route   POST /api/tests/start
 * @desc    Start a new test session
 * @access  Private
 */
router.post('/start', [
  body('step')
    .isInt({ min: 1, max: 3 })
    .withMessage('Test step must be 1, 2, or 3')
], authMiddleware, asyncHandler(startTest));

/**
 * @route   GET /api/tests/session/:sessionId
 * @desc    Get current test session details
 * @access  Private
 */
router.get('/session/:sessionId', [
  param('sessionId').isMongoId().withMessage('Invalid session ID')
], authMiddleware, asyncHandler(getTestSession));

/**
 * @route   POST /api/tests/session/:sessionId/answer
 * @desc    Submit answer for a question
 * @access  Private
 */
router.post('/session/:sessionId/answer', [
  param('sessionId').isMongoId().withMessage('Invalid session ID'),
  body('questionId').isMongoId().withMessage('Invalid question ID'),
  body('selectedOption')
    .isInt({ min: 0 })
    .withMessage('Selected option must be a valid index'),
  body('timeSpent')
    .isInt({ min: 0 })
    .withMessage('Time spent must be a positive number')
], authMiddleware, asyncHandler(submitAnswer));

/**
 * @route   POST /api/tests/session/:sessionId/submit
 * @desc    Submit entire test session
 * @access  Private
 */
router.post('/session/:sessionId/submit', [
  param('sessionId').isMongoId().withMessage('Invalid session ID')
], authMiddleware, asyncHandler(submitTest));

/**
 * @route   GET /api/tests/history
 * @desc    Get user's test history
 * @access  Private
 */
router.get('/history', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
], authMiddleware, asyncHandler(getTestHistory));

export default router;
