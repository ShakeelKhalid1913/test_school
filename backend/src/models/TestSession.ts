import mongoose, { Schema } from 'mongoose';
import { ITestSession, TestStep, TestStatus, AssessmentLevel } from '../types';

/**
 * Test Session Schema for tracking user test attempts
 * Handles test progress, timing, and scoring
 */
const testSessionSchema = new Schema<ITestSession>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  step: {
    type: Number,
    enum: Object.values(TestStep),
    required: [true, 'Test step is required']
  },
  questions: [{
    type: Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  }],
  answers: [{
    questionId: {
      type: Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    selectedOption: {
      type: Number,
      required: true,
      min: [0, 'Selected option must be at least 0']
    },
    isCorrect: {
      type: Boolean,
      required: true
    },
    timeSpent: {
      type: Number,
      required: true,
      min: [0, 'Time spent cannot be negative']
    }
  }],
  startTime: {
    type: Date,
    required: [true, 'Start time is required'],
    default: Date.now
  },
  endTime: {
    type: Date,
    default: null
  },
  timeLimit: {
    type: Number,
    required: [true, 'Time limit is required'],
    min: [1, 'Time limit must be at least 1 minute']
  },
  status: {
    type: String,
    enum: Object.values(TestStatus),
    default: TestStatus.NOT_STARTED
  },
  score: {
    type: Number,
    default: 0,
    min: [0, 'Score cannot be negative']
  },
  percentage: {
    type: Number,
    default: 0,
    min: [0, 'Percentage cannot be negative'],
    max: [100, 'Percentage cannot exceed 100']
  },
  levelAchieved: {
    type: String,
    enum: Object.values(AssessmentLevel),
    default: null
  },
  canProceedToNext: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

/**
 * Calculate score and percentage before saving
 */
testSessionSchema.pre('save', function(next) {
  if (this.answers && this.answers.length > 0) {
    const correctAnswers = this.answers.filter(answer => answer.isCorrect).length;
    const totalQuestions = this.questions.length;
    
    this.score = correctAnswers;
    this.percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    // Determine level achieved and if user can proceed
    this.determineLevelAndProgression();
  }
  
  next();
});

/**
 * Determine achieved level and progression eligibility based on test step and percentage
 */
testSessionSchema.methods.determineLevelAndProgression = function() {
  const percentage = this.percentage;
  
  switch (this.step) {
    case TestStep.STEP_1:
      if (percentage < 25) {
        this.levelAchieved = null;
        this.canProceedToNext = false;
      } else if (percentage < 50) {
        this.levelAchieved = AssessmentLevel.A1;
        this.canProceedToNext = false;
      } else if (percentage < 75) {
        this.levelAchieved = AssessmentLevel.A2;
        this.canProceedToNext = false;
      } else {
        this.levelAchieved = AssessmentLevel.A2;
        this.canProceedToNext = true;
      }
      break;
      
    case TestStep.STEP_2:
      if (percentage < 25) {
        this.levelAchieved = AssessmentLevel.A2; // Remain at A2
        this.canProceedToNext = false;
      } else if (percentage < 50) {
        this.levelAchieved = AssessmentLevel.B1;
        this.canProceedToNext = false;
      } else if (percentage < 75) {
        this.levelAchieved = AssessmentLevel.B2;
        this.canProceedToNext = false;
      } else {
        this.levelAchieved = AssessmentLevel.B2;
        this.canProceedToNext = true;
      }
      break;
      
    case TestStep.STEP_3:
      if (percentage < 25) {
        this.levelAchieved = AssessmentLevel.B2; // Remain at B2
        this.canProceedToNext = false;
      } else if (percentage < 50) {
        this.levelAchieved = AssessmentLevel.C1;
        this.canProceedToNext = false;
      } else {
        this.levelAchieved = AssessmentLevel.C2;
        this.canProceedToNext = false; // No next step after C2
      }
      break;
  }
};

/**
 * Check if test session has expired
 */
testSessionSchema.methods.isExpired = function(): boolean {
  if (!this.startTime || this.status === TestStatus.COMPLETED) {
    return false;
  }
  
  const now = new Date();
  const expiredTime = new Date(this.startTime.getTime() + (this.timeLimit * 60 * 1000));
  
  return now > expiredTime;
};

/**
 * Get remaining time in minutes
 */
testSessionSchema.methods.getRemainingTime = function(): number {
  if (!this.startTime || this.status === TestStatus.COMPLETED) {
    return 0;
  }
  
  const now = new Date();
  const expiredTime = new Date(this.startTime.getTime() + (this.timeLimit * 60 * 1000));
  const remainingMs = expiredTime.getTime() - now.getTime();
  
  return Math.max(0, Math.ceil(remainingMs / (60 * 1000)));
};

// Indexes for better query performance
testSessionSchema.index({ userId: 1, step: 1 });
testSessionSchema.index({ status: 1 });
testSessionSchema.index({ startTime: 1 });
testSessionSchema.index({ userId: 1, createdAt: -1 });

const TestSession = mongoose.model<ITestSession>('TestSession', testSessionSchema);

export default TestSession;
