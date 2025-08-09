import { Response } from 'express';
import { validationResult } from 'express-validator';
import Question from '../models/Question';
import { AuthRequest, ApiResponse, CompetencyArea, AssessmentLevel, TestStep } from '../types';
import { AppError } from '../middleware/errorHandler';

/**
 * Create a new question
 */
export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      } as ApiResponse);
    }

    const {
      title,
      description,
      options,
      competencyArea,
      level,
      difficulty,
      step
    } = req.body;

    const userId = req.user!.userId;

    // Validate options
    if (!options || options.length < 2 || options.length > 4) {
      throw new AppError('Question must have between 2 and 4 options', 400);
    }

    const hasCorrectAnswer = options.some((option: any) => option.isCorrect);
    if (!hasCorrectAnswer) {
      throw new AppError('Question must have at least one correct answer', 400);
    }

    const question = new Question({
      title,
      description,
      options,
      competencyArea,
      level,
      difficulty,
      step,
      createdBy: userId,
      isActive: true
    });

    await question.save();

    res.status(201).json({
      success: true,
      message: 'Question created successfully',
      data: question
    } as ApiResponse);

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      } as ApiResponse);
    }

    console.error('Error creating question:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Get all questions with filtering and pagination
 */
export const getQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const {
      page = 1,
      limit = 10,
      level,
      competencyArea,
      difficulty,
      step,
      isActive
    } = req.query;

    const filter: any = {};

    if (level) filter.level = level;
    if (competencyArea) filter.competencyArea = competencyArea;
    if (difficulty) filter.difficulty = difficulty;
    if (step) filter.step = parseInt(step as string);
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const questions = await Question.find(filter)
      .populate('createdBy', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber);

    const total = await Question.countDocuments(filter);

    res.status(200).json({
      success: true,
      message: 'Questions retrieved successfully',
      data: {
        questions,
        pagination: {
          currentPage: pageNumber,
          totalPages: Math.ceil(total / limitNumber),
          totalQuestions: total,
          hasNext: pageNumber * limitNumber < total,
          hasPrev: pageNumber > 1
        }
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Error getting questions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Get question by ID
 */
export const getQuestionById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const question = await Question.findById(id)
      .populate('createdBy', 'firstName lastName email');

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Question retrieved successfully',
      data: question
    } as ApiResponse);

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      } as ApiResponse);
    }

    console.error('Error getting question:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Update question
 */
export const updateQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      } as ApiResponse);
    }

    const { id } = req.params;
    const updateData = req.body;

    // Validate options if provided
    if (updateData.options) {
      if (updateData.options.length < 2 || updateData.options.length > 4) {
        throw new AppError('Question must have between 2 and 4 options', 400);
      }

      const hasCorrectAnswer = updateData.options.some((option: any) => option.isCorrect);
      if (!hasCorrectAnswer) {
        throw new AppError('Question must have at least one correct answer', 400);
      }
    }

    const question = await Question.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate('createdBy', 'firstName lastName email');

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Question updated successfully',
      data: question
    } as ApiResponse);

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      } as ApiResponse);
    }

    console.error('Error updating question:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Delete question
 */
export const deleteQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      throw new AppError('Question not found', 404);
    }

    res.status(200).json({
      success: true,
      message: 'Question deleted successfully'
    } as ApiResponse);

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      } as ApiResponse);
    }

    console.error('Error deleting question:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Get questions by level
 */
export const getQuestionsByLevel = async (req: AuthRequest, res: Response) => {
  try {
    const { level } = req.params;
    const { step, limit = 20 } = req.query;

    const filter: any = { 
      level,
      isActive: true
    };

    if (step) {
      filter.step = parseInt(step as string);
    }

    const questions = await Question.find(filter)
      .select('-createdBy') // Don't include creator info for test questions
      .limit(parseInt(limit as string))
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: `Questions for level ${level} retrieved successfully`,
      data: {
        level,
        questions,
        total: questions.length
      }
    } as ApiResponse);

  } catch (error) {
    console.error('Error getting questions by level:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Bulk create questions
 */
export const bulkCreateQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      } as ApiResponse);
    }

    const { questions } = req.body;
    const userId = req.user!.userId;

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new AppError('Questions array is required and cannot be empty', 400);
    }

    // Validate each question
    const validatedQuestions = questions.map((questionData: any, index: number) => {
      if (!questionData.options || questionData.options.length < 2 || questionData.options.length > 4) {
        throw new AppError(`Question ${index + 1}: Must have between 2 and 4 options`, 400);
      }

      const hasCorrectAnswer = questionData.options.some((option: any) => option.isCorrect);
      if (!hasCorrectAnswer) {
        throw new AppError(`Question ${index + 1}: Must have at least one correct answer`, 400);
      }

      return {
        ...questionData,
        createdBy: userId,
        isActive: true
      };
    });

    const createdQuestions = await Question.insertMany(validatedQuestions);

    res.status(201).json({
      success: true,
      message: `${createdQuestions.length} questions created successfully`,
      data: {
        created: createdQuestions.length,
        questions: createdQuestions
      }
    } as ApiResponse);

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      } as ApiResponse);
    }

    console.error('Error bulk creating questions:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};
