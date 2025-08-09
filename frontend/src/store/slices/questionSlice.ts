import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  step: number;
  level: string;
  difficulty: 'easy' | 'medium' | 'hard';
  createdAt: string;
  updatedAt: string;
}

interface QuestionFilters {
  step?: number;
  level?: string;
  difficulty?: string;
  searchText?: string;
}

interface QuestionState {
  questions: Question[];
  currentQuestion: Question | null;
  filters: QuestionFilters;
  loading: boolean;
  error: string | null;
  totalQuestions: number;
  currentPage: number;
  questionsPerPage: number;
}

const initialState: QuestionState = {
  questions: [],
  currentQuestion: null,
  filters: {},
  loading: false,
  error: null,
  totalQuestions: 0,
  currentPage: 1,
  questionsPerPage: 10,
};

/**
 * Question slice
 * Manages question state for both test-taking and admin management
 */
const questionSlice = createSlice({
  name: 'question',
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

    // Set questions list
    setQuestions: (state, action: PayloadAction<{
      questions: Question[];
      total: number;
      page: number;
    }>) => {
      state.questions = action.payload.questions;
      state.totalQuestions = action.payload.total;
      state.currentPage = action.payload.page;
      state.loading = false;
      state.error = null;
    },

    // Add new question
    addQuestion: (state, action: PayloadAction<Question>) => {
      state.questions.unshift(action.payload);
      state.totalQuestions += 1;
    },

    // Update existing question
    updateQuestion: (state, action: PayloadAction<Question>) => {
      const index = state.questions.findIndex(q => q.id === action.payload.id);
      if (index !== -1) {
        state.questions[index] = action.payload;
      }
      if (state.currentQuestion?.id === action.payload.id) {
        state.currentQuestion = action.payload;
      }
    },

    // Remove question
    removeQuestion: (state, action: PayloadAction<string>) => {
      state.questions = state.questions.filter(q => q.id !== action.payload);
      state.totalQuestions -= 1;
      if (state.currentQuestion?.id === action.payload) {
        state.currentQuestion = null;
      }
    },

    // Set current question for editing
    setCurrentQuestion: (state, action: PayloadAction<Question | null>) => {
      state.currentQuestion = action.payload;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<QuestionFilters>) => {
      state.filters = action.payload;
      state.currentPage = 1; // Reset to first page when filters change
    },

    // Update specific filter
    updateFilter: (state, action: PayloadAction<{ key: keyof QuestionFilters; value: any }>) => {
      state.filters[action.payload.key] = action.payload.value;
      state.currentPage = 1; // Reset to first page when filter changes
    },

    // Clear all filters
    clearFilters: (state) => {
      state.filters = {};
      state.currentPage = 1;
    },

    // Set current page
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },

    // Set questions per page
    setQuestionsPerPage: (state, action: PayloadAction<number>) => {
      state.questionsPerPage = action.payload;
      state.currentPage = 1; // Reset to first page when page size changes
    },

    // Clear all question state
    clearQuestionState: (state) => {
      return initialState;
    },

    // Set test questions (for test interface)
    setTestQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
      state.loading = false;
      state.error = null;
    },

    // Bulk update questions
    bulkUpdateQuestions: (state, action: PayloadAction<Question[]>) => {
      action.payload.forEach(updatedQuestion => {
        const index = state.questions.findIndex(q => q.id === updatedQuestion.id);
        if (index !== -1) {
          state.questions[index] = updatedQuestion;
        } else {
          state.questions.push(updatedQuestion);
        }
      });
    },

    // Sort questions
    sortQuestions: (state, action: PayloadAction<{
      field: keyof Question;
      direction: 'asc' | 'desc';
    }>) => {
      const { field, direction } = action.payload;
      state.questions.sort((a, b) => {
        const aValue = a[field];
        const bValue = b[field];
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return direction === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return 0;
      });
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setQuestions,
  addQuestion,
  updateQuestion,
  removeQuestion,
  setCurrentQuestion,
  setFilters,
  updateFilter,
  clearFilters,
  setCurrentPage,
  setQuestionsPerPage,
  clearQuestionState,
  setTestQuestions,
  bulkUpdateQuestions,
  sortQuestions,
} = questionSlice.actions;

export default questionSlice.reducer;

// Selectors
export const selectQuestions = (state: { question: QuestionState }) => state.question.questions;
export const selectCurrentQuestion = (state: { question: QuestionState }) => state.question.currentQuestion;
export const selectQuestionFilters = (state: { question: QuestionState }) => state.question.filters;
export const selectQuestionLoading = (state: { question: QuestionState }) => state.question.loading;
export const selectQuestionError = (state: { question: QuestionState }) => state.question.error;
export const selectTotalQuestions = (state: { question: QuestionState }) => state.question.totalQuestions;
export const selectCurrentPage = (state: { question: QuestionState }) => state.question.currentPage;
export const selectQuestionsPerPage = (state: { question: QuestionState }) => state.question.questionsPerPage;
export const selectTotalPages = (state: { question: QuestionState }) => 
  Math.ceil(state.question.totalQuestions / state.question.questionsPerPage);
export const selectQuestionsByLevel = (state: { question: QuestionState }, level: string) =>
  state.question.questions.filter(q => q.level === level);
export const selectQuestionsByStep = (state: { question: QuestionState }, step: number) =>
  state.question.questions.filter(q => q.step === step);
export const selectQuestionsByDifficulty = (state: { question: QuestionState }, difficulty: string) =>
  state.question.questions.filter(q => q.difficulty === difficulty);
