import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthState } from '../../types';

/**
 * Initial state for authentication
 */
const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

/**
 * Authentication slice
 * Manages user authentication state, tokens, and auth-related UI state
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set loading state
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
      if (action.payload) {
        state.error = null;
      }
    },

    /**
     * Set error state
     */
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    /**
     * Clear error state
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Set authentication data (login/register success)
     */
    setAuthData: (state, action: PayloadAction<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Update user profile data
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    /**
     * Update access token (from refresh)
     */
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },

    /**
     * Update tokens (from refresh)
     */
    updateTokens: (state, action: PayloadAction<{
      accessToken: string;
      refreshToken: string;
    }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    /**
     * Logout user (clear all auth state)
     */
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },

    /**
     * Clear all auth state
     */
    clearAuth: (state) => {
      Object.assign(state, initialState);
    },

    /**
     * Set email verification status
     */
    setEmailVerified: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isEmailVerified = action.payload;
      }
    },

    /**
     * Set user test eligibility
     */
    setTestEligibility: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.canTakeTest = action.payload;
      }
    },

    /**
     * Update user level after test completion
     */
    updateUserLevel: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.currentLevel = action.payload as any;
      }
    },
  },
});

/**
 * Export actions
 */
export const {
  setLoading,
  setError,
  clearError,
  setAuthData,
  updateUser,
  updateAccessToken,
  updateTokens,
  logout,
  clearAuth,
  setEmailVerified,
  setTestEligibility,
  updateUserLevel,
} = authSlice.actions;

/**
 * Selectors
 */
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectAccessToken = (state: { auth: AuthState }) => state.auth.accessToken;
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

/**
 * Export reducer
 */
export default authSlice.reducer;
