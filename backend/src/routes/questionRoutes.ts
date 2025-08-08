import express from 'express';
import { body, param, query } from 'express-validator';
import {
  createQuestion,
  getQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  getQuestionsByLevel,
  bulkCreateQuestions
} from '../controllers/questionController';
import { asyncHandler } from '../middleware/errorHandler';
import { authMiddleware, adminOnly, supervisorOrAdmin } from '../middleware/authMiddleware';

const router = express.Router();

/**
 * @route   POST /api/questions
 * @desc    Create a new question (Admin/Supervisor only)
 * @access  Private (Admin/Supervisor)
 */
router.post('/', [
  body('title')
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Question title must be between 10 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Question description must be between 20 and 1000 characters'),
  body('options')
    .isArray({ min: 2, max: 4 })
    .withMessage('Question must have between 2 and 4 options'),
  body('options.*.text')
    .trim()
    .isLength({ min: 1, max: 300 })
    .withMessage('Option text must be between 1 and 300 characters'),
  body('options.*.isCorrect')
    .isBoolean()
    .withMessage('Option correctness must be a boolean'),
  body('competencyArea')
    .notEmpty()
    .withMessage('Competency area is required'),
  body('level')
    .isIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
    .withMessage('Level must be one of: A1, A2, B1, B2, C1, C2'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard')
], supervisorOrAdmin, asyncHandler(createQuestion));

/**
 * @route   POST /api/questions/bulk
 * @desc    Create multiple questions (Admin only)
 * @access  Private (Admin)
 */
router.post('/bulk', [
  body('questions')
    .isArray({ min: 1 })
    .withMessage('Questions array is required with at least one question')
], adminOnly, asyncHandler(bulkCreateQuestions));

/**
 * @route   GET /api/questions
 * @desc    Get all questions with pagination and filters (Admin/Supervisor only)
 * @access  Private (Admin/Supervisor)
 */
router.get('/', [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('level')
    .optional()
    .isIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
    .withMessage('Level must be one of: A1, A2, B1, B2, C1, C2'),
  query('competencyArea')
    .optional()
    .withMessage('Invalid competency area'),
  query('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  query('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
], supervisorOrAdmin, asyncHandler(getQuestions));

/**
 * @route   GET /api/questions/level/:level
 * @desc    Get questions by assessment level
 * @access  Private
 */
router.get('/level/:level', [
  param('level')
    .isIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
    .withMessage('Level must be one of: A1, A2, B1, B2, C1, C2'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
], authMiddleware, asyncHandler(getQuestionsByLevel));

/**
 * @route   GET /api/questions/:id
 * @desc    Get question by ID (Admin/Supervisor only)
 * @access  Private (Admin/Supervisor)
 */
router.get('/:id', [
  param('id').isMongoId().withMessage('Invalid question ID')
], supervisorOrAdmin, asyncHandler(getQuestionById));

/**
 * @route   PUT /api/questions/:id
 * @desc    Update question (Admin/Supervisor only)
 * @access  Private (Admin/Supervisor)
 */
router.put('/:id', [
  param('id').isMongoId().withMessage('Invalid question ID'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage('Question title must be between 10 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 1000 })
    .withMessage('Question description must be between 20 and 1000 characters'),
  body('options')
    .optional()
    .isArray({ min: 2, max: 4 })
    .withMessage('Question must have between 2 and 4 options'),
  body('level')
    .optional()
    .isIn(['A1', 'A2', 'B1', 'B2', 'C1', 'C2'])
    .withMessage('Level must be one of: A1, A2, B1, B2, C1, C2'),
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Difficulty must be easy, medium, or hard'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean')
], supervisorOrAdmin, asyncHandler(updateQuestion));

/**
 * @route   DELETE /api/questions/:id
 * @desc    Delete question (Admin only)
 * @access  Private (Admin)
 */
router.delete('/:id', [
  param('id').isMongoId().withMessage('Invalid question ID')
], adminOnly, asyncHandler(deleteQuestion));

export default router;
