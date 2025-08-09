import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface TestSession {
  id: string;
  userId: string;
  step: number;
  level: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  answers: number[];
  timeSpent: number;
  startTime: string;
  endTime: string;
  nextLevel?: string;
  certificateUrl?: string;
  createdAt: string;
  updatedAt: string;
}

interface TestResult {
  score: number;
  totalQuestions: number;
  passed: boolean;
  percentage: number;
  timeSpent: number;
  nextLevel?: string;
  certificateUrl?: string;
  session: TestSession;
}

interface StartTestRequest {
  step: number;
  level: string;
}

interface SubmitTestRequest {
  sessionId: string;
  answers: number[];
  timeSpent: number;
}

interface TestHistory {
  sessions: TestSession[];
  total: number;
  page: number;
  totalPages: number;
}

interface TestStats {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  averageScore: number;
  currentLevel: string;
  completedLevels: string[];
  nextAvailableLevel?: string;
}

/**
 * Test API slice
 * Handles test-related API calls including starting tests, submitting answers, and viewing history
 */
export const testApi = createApi({
  reducerPath: 'testApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    prepareHeaders: (headers, { getState }) => {
      // Get the token from localStorage or Redux state
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Test', 'TestHistory'],
  endpoints: (builder) => ({
    // Start a new test session
    startTest: builder.mutation<{ sessionId: string; questions: any[] }, StartTestRequest>({
      query: (data) => ({
        url: '/tests/start',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Test'],
    }),

    // Submit test answers
    submitTest: builder.mutation<TestResult, SubmitTestRequest>({
      query: (data) => ({
        url: '/tests/submit',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Test', 'TestHistory'],
    }),

    // Get current user's test history
    getTestHistory: builder.query<TestHistory, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/tests/history?page=${page}&limit=${limit}`,
      providesTags: ['TestHistory'],
    }),

    // Get test session by ID
    getTestSession: builder.query<TestSession, string>({
      query: (sessionId) => `/tests/session/${sessionId}`,
      providesTags: ['Test'],
    }),

    // Get user's test statistics
    getTestStats: builder.query<TestStats, void>({
      query: () => '/tests/stats',
      providesTags: ['Test'],
    }),

    // Get all test sessions (admin only)
    getAllTestSessions: builder.query<TestHistory, { 
      page?: number; 
      limit?: number; 
      userId?: string;
      level?: string;
      passed?: boolean;
    }>({
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `/tests/admin/sessions?${params.toString()}`;
      },
      providesTags: ['TestHistory'],
    }),

    // Get test analytics (admin only)
    getTestAnalytics: builder.query<{
      totalSessions: number;
      passRate: number;
      averageScore: number;
      levelDistribution: Record<string, number>;
      recentSessions: TestSession[];
      popularQuestions: any[];
    }, void>({
      query: () => '/tests/admin/analytics',
    }),

    // Retake a failed test
    retakeTest: builder.mutation<{ sessionId: string; questions: any[] }, { level: string }>({
      query: (data) => ({
        url: '/tests/retake',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Test'],
    }),

    // Download certificate
    downloadCertificate: builder.query<Blob, string>({
      query: (sessionId) => ({
        url: `/tests/certificate/${sessionId}`,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Check if user can take next level test
    checkNextLevel: builder.query<{ canTakeNext: boolean; nextLevel?: string; requirements?: string }, void>({
      query: () => '/tests/next-level',
      providesTags: ['Test'],
    }),
  }),
});

export const {
  useStartTestMutation,
  useSubmitTestMutation,
  useGetTestHistoryQuery,
  useGetTestSessionQuery,
  useGetTestStatsQuery,
  useGetAllTestSessionsQuery,
  useGetTestAnalyticsQuery,
  useRetakeTestMutation,
  useDownloadCertificateQuery,
  useCheckNextLevelQuery,
} = testApi;
