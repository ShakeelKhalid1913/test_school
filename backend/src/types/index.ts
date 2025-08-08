import { Document } from 'mongoose';

// User role enumeration
export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  SUPERVISOR = 'supervisor'
}

// Assessment levels enumeration
export enum AssessmentLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

// Test steps enumeration
export enum TestStep {
  STEP_1 = 1,
  STEP_2 = 2,
  STEP_3 = 3
}

// Test status enumeration
export enum TestStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  TIME_EXPIRED = 'time_expired'
}

// Competency areas (22 total)
export enum CompetencyArea {
  DIGITAL_LITERACY = 'digital_literacy',
  INFORMATION_MANAGEMENT = 'information_management',
  COMMUNICATION = 'communication',
  COLLABORATION = 'collaboration',
  CONTENT_CREATION = 'content_creation',
  SAFETY = 'safety',
  PROBLEM_SOLVING = 'problem_solving',
  CAREER_DEVELOPMENT = 'career_development',
  // Add more competency areas as needed
}

// User interface
export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  passwordResetToken?: string;
  passwordResetExpires?: Date;
  otpCode?: string;
  otpExpires?: Date;
  currentLevel: AssessmentLevel | null;
  canTakeTest: boolean;
  lastTestAttempt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Question interface
export interface IQuestion extends Document {
  _id: string;
  title: string;
  description: string;
  options: {
    text: string;
    isCorrect: boolean;
  }[];
  competencyArea: CompetencyArea;
  level: AssessmentLevel;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

// Test session interface
export interface ITestSession extends Document {
  _id: string;
  userId: string;
  step: TestStep;
  questions: string[]; // Question IDs
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    timeSpent: number; // in seconds
  }[];
  startTime: Date;
  endTime?: Date;
  timeLimit: number; // in minutes
  status: TestStatus;
  score: number;
  percentage: number;
  levelAchieved?: AssessmentLevel;
  canProceedToNext: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Certificate interface
export interface ICertificate extends Document {
  _id: string;
  userId: string;
  level: AssessmentLevel;
  issueDate: Date;
  certificateNumber: string;
  isValid: boolean;
  testSessionId: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response interface
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// JWT Payload interface
export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Test configuration interface
export interface TestConfig {
  questionsPerLevel: number;
  timePerQuestion: number; // in minutes
  passingScores: {
    [TestStep.STEP_1]: {
      fail: number;
      A1: number;
      A2: number;
      proceed: number;
    };
    [TestStep.STEP_2]: {
      fail: number;
      B1: number;
      B2: number;
      proceed: number;
    };
    [TestStep.STEP_3]: {
      fail: number;
      C1: number;
      C2: number;
    };
  };
}

// Request interfaces with user authentication
export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: UserRole;
  };
}

// Email template data interface
export interface EmailTemplateData {
  name: string;
  email: string;
  otpCode?: string;
  resetLink?: string;
  certificateLevel?: AssessmentLevel;
  [key: string]: any;
}
