import { Response } from 'express';
import { validationResult } from 'express-validator';
import TestSession from '../models/TestSession';
import Question from '../models/Question';
import User from '../models/User';
import { AuthRequest, ApiResponse, TestStep, TestStatus, AssessmentLevel } from '../types';
import { AppError } from '../middleware/errorHandler';

/**
 * Start a new test session
 */
export const startTest = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      } as ApiResponse);
    }

    const { step } = req.body;
    const userId = req.user!.userId;

    // Check if user can take this test step
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (!user.canTakeTestStep(step)) {
      throw new AppError('You are not eligible to take this test step', 403);
    }

    // Check for existing active test session
    const existingSession = await TestSession.findOne({
      userId,
      step,
      status: TestStatus.IN_PROGRESS
    });

    if (existingSession) {
      return res.status(200).json({
        success: true,
        message: 'Test session already in progress',
        data: existingSession
      } as ApiResponse);
    }

    // Get questions for this step
    const questions = await Question.find({
      step,
      isActive: true
    }).limit(20); // 20 questions per test

    if (questions.length === 0) {
      throw new AppError('No questions available for this test step', 404);
    }

    // Create new test session
    const testSession = new TestSession({
      userId,
      step,
      questions: questions.map(q => q._id),
      answers: [],
      timeLimit: 30, // 30 minutes
      status: TestStatus.IN_PROGRESS,
      score: 0,
      percentage: 0,
      canProceedToNext: false
    });

    await testSession.save();

    res.status(201).json({
      success: true,
      message: 'Test session started successfully',
      data: {
        sessionId: testSession._id,
        questions: questions.map(q => ({
          id: q._id,
          title: q.title,
          description: q.description,
          options: q.options.map(opt => ({ text: opt.text })) // Don't send correct answers
        })),
        timeLimit: testSession.timeLimit,
        totalQuestions: questions.length
      }
    } as ApiResponse);

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      } as ApiResponse);
    }

    console.error('Error starting test:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Submit answer for a question
 */
export const submitAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      } as ApiResponse);
    }

    const { sessionId } = req.params;
    const { questionId, selectedOption, timeSpent } = req.body;
    const userId = req.user!.userId;

    // Find test session
    const testSession = await TestSession.findOne({
      _id: sessionId,
      userId,
      status: TestStatus.IN_PROGRESS
    });

    if (!testSession) {
      throw new AppError('Test session not found or not active', 404);
    }

    // Find the question to check correct answer
    const question = await Question.findById(questionId);
    if (!question) {
      throw new AppError('Question not found', 404);
    }

    // Check if question belongs to this test session
    if (!testSession.questions.includes(questionId)) {
      throw new AppError('Question does not belong to this test session', 400);
    }

    // Check if answer already exists for this question
    const existingAnswerIndex = testSession.answers.findIndex(
      answer => answer.questionId.toString() === questionId
    );

    const isCorrect = question.options[selectedOption]?.isCorrect || false;

    const answerData = {
      questionId,
      selectedOption,
      isCorrect,
      timeSpent
    };

    if (existingAnswerIndex >= 0) {
      // Update existing answer
      testSession.answers[existingAnswerIndex] = answerData;
    } else {
      // Add new answer
      testSession.answers.push(answerData);
    }

    await testSession.save();

    res.status(200).json({
      success: true,
      message: 'Answer submitted successfully',
      data: {
        questionId,
        isCorrect,
        totalAnswered: testSession.answers.length,
        totalQuestions: testSession.questions.length
      }
    } as ApiResponse);

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      } as ApiResponse);
    }

    console.error('Error submitting answer:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Complete test session and calculate results
 */
export const completeTest = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user!.userId;

    // Find test session
    const testSession = await TestSession.findOne({
      _id: sessionId,
      userId,
      status: TestStatus.IN_PROGRESS
    });

    if (!testSession) {
      throw new AppError('Test session not found or not active', 404);
    }

    // Mark test as completed
    testSession.status = TestStatus.COMPLETED;
    testSession.endTime = new Date();

    // Calculate final score
    testSession.calculateScore();

    await testSession.save();

    // Update user's level and test eligibility
    const user = await User.findById(userId);
    if (user) {
      // Update user level based on test results
      if (testSession.percentage >= 75) {
        // User can proceed to next step
        switch (testSession.step) {
          case TestStep.STEP_1:
            user.currentLevel = AssessmentLevel.A2;
            break;
          case TestStep.STEP_2:
            user.currentLevel = AssessmentLevel.B2;
            break;
          case TestStep.STEP_3:
            user.currentLevel = AssessmentLevel.C2;
            break;
        }
      } else if (testSession.percentage >= 50) {
        // User gets intermediate level
        switch (testSession.step) {
          case TestStep.STEP_1:
            user.currentLevel = AssessmentLevel.A2;
            break;
          case TestStep.STEP_2:
            user.currentLevel = AssessmentLevel.B2;
            break;
          case TestStep.STEP_3:
            user.currentLevel = AssessmentLevel.C1;
            break;
        }
      } else if (testSession.percentage >= 25) {
        // User gets basic level
        switch (testSession.step) {
          case TestStep.STEP_1:
            user.currentLevel = AssessmentLevel.A1;
            break;
          case TestStep.STEP_2:
            user.currentLevel = AssessmentLevel.B1;
            break;
          case TestStep.STEP_3:
            user.currentLevel = AssessmentLevel.C1;
            break;
        }
      } else {
        // Failed the test
        if (testSession.step === TestStep.STEP_1) {
          user.canTakeTest = false; // Cannot retake Step 1
        }
        // For other steps, user remains at current level
      }

      user.lastTestAttempt = new Date();
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Test completed successfully',
      data: {
        sessionId: testSession._id,
        score: testSession.score,
        percentage: testSession.percentage,
        levelAchieved: user?.currentLevel,
        canProceedToNext: testSession.percentage >= 75,
        timeTaken: testSession.endTime.getTime() - testSession.startTime.getTime(),
        totalQuestions: testSession.questions.length,
        correctAnswers: testSession.score
      }
    } as ApiResponse);

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      } as ApiResponse);
    }

    console.error('Error completing test:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Get user's test history
 */
export const getTestHistory = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const testHistory = await TestSession.find({
      userId,
      status: { $in: [TestStatus.COMPLETED, TestStatus.FAILED] }
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Test history retrieved successfully',
      data: testHistory
    } as ApiResponse);

  } catch (error) {
    console.error('Error getting test history:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Get current active test session
 */
export const getCurrentTest = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const currentTest = await TestSession.findOne({
      userId,
      status: TestStatus.IN_PROGRESS
    }).populate('questions');

    if (!currentTest) {
      return res.status(404).json({
        success: false,
        message: 'No active test session found'
      } as ApiResponse);
    }

    res.status(200).json({
      success: true,
      message: 'Current test session retrieved',
      data: currentTest
    } as ApiResponse);

  } catch (error) {
    console.error('Error getting current test:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Submit entire test (alias for completeTest)
 */
export const submitTest = completeTest;

/**
 * Get test session by ID
 */
export const getTestSession = async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user!.userId;

    const testSession = await TestSession.findOne({
      _id: sessionId,
      userId
    }).populate('questions');

    if (!testSession) {
      return res.status(404).json({
        success: false,
        message: 'Test session not found'
      } as ApiResponse);
    }

    res.status(200).json({
      success: true,
      message: 'Test session retrieved successfully',
      data: testSession
    } as ApiResponse);

  } catch (error) {
    console.error('Error getting test session:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Get available tests for current user
 */
export const getAvailableTests = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;

    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    const availableTests = [];

    // Check which test steps user can take
    for (let step = 1; step <= 3; step++) {
      if (user.canTakeTestStep(step)) {
        const questionCount = await Question.countDocuments({
          step,
          isActive: true
        });

        availableTests.push({
          step,
          name: `Step ${step} Assessment`,
          description: getStepDescription(step),
          questionCount,
          timeLimit: 30, // 30 minutes
          levels: getStepLevels(step)
        });
      }
    }

    res.status(200).json({
      success: true,
      message: 'Available tests retrieved successfully',
      data: {
        availableTests,
        currentLevel: user.currentLevel,
        canTakeTest: user.canTakeTest
      }
    } as ApiResponse);

  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message
      } as ApiResponse);
    }

    console.error('Error getting available tests:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    } as ApiResponse);
  }
};

/**
 * Helper function to get step description
 */
function getStepDescription(step: number): string {
  switch (step) {
    case 1:
      return 'Basic digital competency assessment covering fundamental computer skills';
    case 2:
      return 'Intermediate digital competency assessment covering advanced computer skills';
    case 3:
      return 'Advanced digital competency assessment covering expert-level skills';
    default:
      return 'Digital competency assessment';
  }
}

/**
 * Helper function to get step levels
 */
function getStepLevels(step: number): string[] {
  switch (step) {
    case 1:
      return ['A1', 'A2'];
    case 2:
      return ['B1', 'B2'];
    case 3:
      return ['C1', 'C2'];
    default:
      return [];
  }
}
