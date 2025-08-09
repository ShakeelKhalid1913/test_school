import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  currentLevel: string;
  testsCompleted: number;
  lastTestDate?: string;
  isVerified: boolean;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

/**
 * User slice
 * Manages user authentication state and profile information
 */
const userSlice = createSlice({
  name: 'user',
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

    // Set current user (login success)
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
    },

    // Update current user profile
    updateCurrentUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },

    // Clear current user (logout)
    clearCurrentUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },

    // Set authentication status
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      if (!action.payload) {
        state.currentUser = null;
      }
    },

    // Update user level after test completion
    updateUserLevel: (state, action: PayloadAction<{ level: string; testsCompleted: number }>) => {
      if (state.currentUser) {
        state.currentUser.currentLevel = action.payload.level;
        state.currentUser.testsCompleted = action.payload.testsCompleted;
        state.currentUser.lastTestDate = new Date().toISOString();
      }
    },

    // Mark user as verified
    markUserVerified: (state) => {
      if (state.currentUser) {
        state.currentUser.isVerified = true;
      }
    },
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setCurrentUser,
  updateCurrentUser,
  clearCurrentUser,
  setAuthenticated,
  updateUserLevel,
  markUserVerified,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectCurrentUser = (state: { user: UserState }) => state.user.currentUser;
export const selectIsAuthenticated = (state: { user: UserState }) => state.user.isAuthenticated;
export const selectUserLoading = (state: { user: UserState }) => state.user.loading;
export const selectUserError = (state: { user: UserState }) => state.user.error;
export const selectUserLevel = (state: { user: UserState }) => state.user.currentUser?.currentLevel;
export const selectUserTestsCompleted = (state: { user: UserState }) => state.user.currentUser?.testsCompleted;
export const selectIsUserVerified = (state: { user: UserState }) => state.user.currentUser?.isVerified;
