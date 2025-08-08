import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  RefreshTokenRequest,
  ApiResponse,
  User,
} from '../types';

/**
 * Base query with authentication header
 */
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/auth',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

/**
 * Auth API service
 * Handles all authentication-related API calls using RTK Query
 */
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  tagTypes: ['Auth', 'User'],
  endpoints: (builder) => ({
    /**
     * Register new user
     */
    register: builder.mutation<ApiResponse<AuthResponse>, RegisterRequest>({
      query: (credentials) => ({
        url: '/register',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    /**
     * Login user
     */
    login: builder.mutation<ApiResponse<AuthResponse>, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),

    /**
     * Refresh access token
     */
    refreshToken: builder.mutation<ApiResponse<{ accessToken: string; refreshToken: string }>, RefreshTokenRequest>({
      query: (data) => ({
        url: '/refresh-token',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Logout user
     */
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),

    /**
     * Verify email address
     */
    verifyEmail: builder.mutation<ApiResponse, string>({
      query: (token) => ({
        url: `/verify-email/${token}`,
        method: 'GET',
      }),
      invalidatesTags: ['Auth'],
    }),

    /**
     * Resend email verification
     */
    resendEmailVerification: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/resend-verification',
        method: 'POST',
      }),
    }),

    /**
     * Send password reset email
     */
    forgotPassword: builder.mutation<ApiResponse, { email: string }>({
      query: (data) => ({
        url: '/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Reset password with token
     */
    resetPassword: builder.mutation<ApiResponse, { token: string; newPassword: string }>({
      query: (data) => ({
        url: '/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    /**
     * Send OTP to user email
     */
    sendOTP: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: '/send-otp',
        method: 'POST',
      }),
    }),

    /**
     * Verify OTP
     */
    verifyOTP: builder.mutation<ApiResponse, { otp: string }>({
      query: (data) => ({
        url: '/verify-otp',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

/**
 * Export hooks for components to use
 */
export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useVerifyEmailMutation,
  useResendEmailVerificationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendOTPMutation,
  useVerifyOTPMutation,
} = authApi;
