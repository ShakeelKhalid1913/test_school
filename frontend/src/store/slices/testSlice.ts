import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  step: number;
  level: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TestSession {
  sessionId: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: number[];
  timeRemaining: number;
  timeSpent: number;
  startTime: string;
  step: number;
  level: string;
  isActive: boolean;
  isSubmitted: boolean;
}

interface TestResult {
  score: number;
  totalQuestions: number;
  passed: boolean;
  percentage: number;
  timeSpent: number;
  nextLevel?: string;
  certificateUrl?: string;
}

interface TestState {
  currentSession: TestSession | null;
  lastResult: TestResult | null;
  loading: boolean;
  error: string | null;
  isTimerRunning: boolean;
}

const initialState: TestState = {
  currentSession: null,
  lastResult: null,
  loading: false,
  error: null,
  isTimerRunning: false,
};

/**
 * Test slice
 * Manages test session state, timer, and results
 */
const testSlice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    // Set error message
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Start new test session
    startTestSession: (state, action: PayloadAction<{
      sessionId: string;
      questions: Question[];
      step: number;
      level: string;
      timeLimit: number;
    }>) => {
      const { sessionId, questions, step, level, timeLimit } = action.payload;
      state.currentSession = {
        sessionId,
        questions,
        currentQuestionIndex: 0,
        answers: new Array(questions.length).fill(-1),
        timeRemaining: timeLimit,
        timeSpent: 0,
        startTime: new Date().toISOString(),
        step,
        level,
        isActive: true,
        isSubmitted: false,
      };
      state.isTimerRunning = true;
      state.loading = false;
      state.error = null;
    },

    // Navigate to question
    goToQuestion: (state, action: PayloadAction<number>) => {
      if (state.currentSession && !state.currentSession.isSubmitted) {
        state.currentSession.currentQuestionIndex = action.payload;
      }
    },

    // Navigate to next question
    nextQuestion: (state) => {
      if (state.currentSession && !state.currentSession.isSubmitted) {
        const maxIndex = state.currentSession.questions.length - 1;
        if (state.currentSession.currentQuestionIndex < maxIndex) {
          state.currentSession.currentQuestionIndex += 1;
        }
      }
    },

    // Navigate to previous question
    previousQuestion: (state) => {
      if (state.currentSession && !state.currentSession.isSubmitted) {
        if (state.currentSession.currentQuestionIndex > 0) {
          state.currentSession.currentQuestionIndex -= 1;
        }
      }
    },

    // Select answer for current question
    selectAnswer: (state, action: PayloadAction<number>) => {
      if (state.currentSession && !state.currentSession.isSubmitted) {
        const questionIndex = state.currentSession.currentQuestionIndex;
        state.currentSession.answers[questionIndex] = action.payload;
      }
    },

    // Update timer (called every second)
    updateTimer: (state) => {
      if (state.currentSession && state.isTimerRunning && !state.currentSession.isSubmitted) {
        state.currentSession.timeRemaining -= 1;
        state.currentSession.timeSpent += 1;
        
        // Auto-submit when time runs out
        if (state.currentSession.timeRemaining <= 0) {
          state.currentSession.isSubmitted = true;
          state.currentSession.isActive = false;
          state.isTimerRunning = false;
        }
      }
    },

    // Start timer
    startTimer: (state) => {
      state.isTimerRunning = true;
    },

    // Stop timer
    stopTimer: (state) => {
      state.isTimerRunning = false;
    },

    // Pause timer
    pauseTimer: (state) => {
      state.isTimerRunning = false;
    },

    // Resume timer
    resumeTimer: (state) => {
      if (state.currentSession && !state.currentSession.isSubmitted) {
        state.isTimerRunning = true;
      }
    },

    // Submit test
    submitTest: (state) => {
      if (state.currentSession) {
        state.currentSession.isSubmitted = true;
        state.currentSession.isActive = false;
        state.isTimerRunning = false;
      }
    },

    // Set test result
    setTestResult: (state, action: PayloadAction<TestResult>) => {
      state.lastResult = action.payload;
      state.loading = false;
    },

    // Clear test session
    clearTestSession: (state) => {
      state.currentSession = null;
      state.isTimerRunning = false;
      state.loading = false;
      state.error = null;
    },

    // Clear test result
    clearTestResult: (state) => {
      state.lastResult = null;
    },

    // Reset test state
    resetTestState: (state) => {
      return initialState;
    },

    // Update session time remaining (for resume functionality)
    setTimeRemaining: (state, action: PayloadAction<number>) => {
      if (state.currentSession) {
        state.currentSession.timeRemaining = action.payload;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  startTestSession,
  goToQuestion,
  nextQuestion,
  previousQuestion,
  selectAnswer,
  updateTimer,
  startTimer,
  stopTimer,
  pauseTimer,
  resumeTimer,
  submitTest,
  setTestResult,
  clearTestSession,
  clearTestResult,
  resetTestState,
  setTimeRemaining,
} = testSlice.actions;

export default testSlice.reducer;

// Selectors
export const selectCurrentSession = (state: { test: TestState }) => state.test.currentSession;
export const selectLastResult = (state: { test: TestState }) => state.test.lastResult;
export const selectTestLoading = (state: { test: TestState }) => state.test.loading;
export const selectTestError = (state: { test: TestState }) => state.test.error;
export const selectIsTimerRunning = (state: { test: TestState }) => state.test.isTimerRunning;
export const selectCurrentQuestion = (state: { test: TestState }) => {
  const session = state.test.currentSession;
  if (!session) return null;
  return session.questions[session.currentQuestionIndex];
};
export const selectCurrentQuestionIndex = (state: { test: TestState }) => 
  state.test.currentSession?.currentQuestionIndex ?? 0;
export const selectTestProgress = (state: { test: TestState }) => {
  const session = state.test.currentSession;
  if (!session) return 0;
  const answered = session.answers.filter(answer => answer !== -1).length;
  return (answered / session.questions.length) * 100;
};
export const selectTimeRemaining = (state: { test: TestState }) => 
  state.test.currentSession?.timeRemaining ?? 0;
export const selectTimeSpent = (state: { test: TestState }) => 
  state.test.currentSession?.timeSpent ?? 0;
