// User types
export enum UserRole {
  ADMIN = 'admin',
  STUDENT = 'student',
  SUPERVISOR = 'supervisor'
}

export enum AssessmentLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
}

export enum TestStep {
  STEP_1 = 1,
  STEP_2 = 2,
  STEP_3 = 3
}

export enum TestStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  TIME_EXPIRED = 'time_expired'
}

export enum CompetencyArea {
  DIGITAL_LITERACY = 'digital_literacy',
  INFORMATION_MANAGEMENT = 'information_management',
  COMMUNICATION = 'communication',
  COLLABORATION = 'collaboration',
  CONTENT_CREATION = 'content_creation',
  SAFETY = 'safety',
  PROBLEM_SOLVING = 'problem_solving',
  CAREER_DEVELOPMENT = 'career_development'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  currentLevel: AssessmentLevel | null;
  canTakeTest: boolean;
  lastTestAttempt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface TestSession {
  id: string;
  userId: string;
  step: TestStep;
  questions: string[];
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    timeSpent: number;
  }[];
  startTime: string;
  endTime?: string;
  timeLimit: number;
  status: TestStatus;
  score: number;
  percentage: number;
  levelAchieved?: AssessmentLevel;
  canProceedToNext: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Certificate {
  id: string;
  userId: string;
  level: AssessmentLevel;
  issueDate: string;
  certificateNumber: string;
  isValid: boolean;
  testSessionId: string;
  createdAt: string;
  updatedAt: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Test types
export interface StartTestRequest {
  step: TestStep;
}

export interface SubmitAnswerRequest {
  questionId: string;
  selectedOption: number;
  timeSpent: number;
}

export interface TestQuestion {
  id: string;
  title: string;
  description: string;
  options: {
    text: string;
  }[];
  competencyArea: CompetencyArea;
  level: AssessmentLevel;
}

export interface TestSessionResponse {
  session: TestSession;
  questions: TestQuestion[];
  currentQuestionIndex: number;
  remainingTime: number;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface AlertState {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  isVisible: boolean;
}

// Redux state types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface TestState {
  currentSession: TestSession | null;
  currentQuestions: TestQuestion[];
  currentQuestionIndex: number;
  remainingTime: number;
  testHistory: TestSession[];
  availableTests: TestStep[];
  isLoading: boolean;
  error: string | null;
}

export interface UserState {
  profile: User | null;
  users: User[];
  testHistory: TestSession[];
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
}

export interface QuestionState {
  questions: Question[];
  totalPages: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}

export interface RootState {
  auth: AuthState;
  test: TestState;
  user: UserState;
  question: QuestionState;
}

// Timer types
export interface TimerState {
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

// Navigation types
export interface NavItem {
  name: string;
  href: string;
  icon?: string;
  current?: boolean;
  requiresAuth?: boolean;
  roles?: UserRole[];
}

// Test configuration
export interface TestConfig {
  questionsPerLevel: number;
  timePerQuestion: number;
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

// Analytics types
export interface TestAnalytics {
  totalAttempts: number;
  passRate: number;
  averageScore: number;
  levelDistribution: Record<AssessmentLevel, number>;
  competencyPerformance: Record<CompetencyArea, number>;
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  levelDistribution: Record<AssessmentLevel, number>;
  roleDistribution: Record<UserRole, number>;
}
