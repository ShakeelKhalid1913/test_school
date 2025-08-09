import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

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

interface CreateQuestionRequest {
  text: string;
  options: string[];
  correctAnswer: number;
  step: number;
  level: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface UpdateQuestionRequest extends Partial<CreateQuestionRequest> {}

interface QuestionFilters {
  step?: number;
  level?: string;
  difficulty?: string;
  limit?: number;
  page?: number;
}

interface QuestionsResponse {
  questions: Question[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Question API slice
 * Handles question-related API calls including CRUD operations
 */
export const questionApi = createApi({
  reducerPath: 'questionApi',
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
  tagTypes: ['Question'],
  endpoints: (builder) => ({
    // Get questions with filters
    getQuestions: builder.query<QuestionsResponse, QuestionFilters>({
      query: (filters) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) {
            params.append(key, value.toString());
          }
        });
        return `/questions?${params.toString()}`;
      },
      providesTags: ['Question'],
    }),

    // Get questions for test (specific step and level)
    getTestQuestions: builder.query<Question[], { step: number; level: string }>({
      query: ({ step, level }) => `/questions/test?step=${step}&level=${level}`,
      providesTags: ['Question'],
    }),

    // Get question by ID
    getQuestionById: builder.query<Question, string>({
      query: (id) => `/questions/${id}`,
      providesTags: ['Question'],
    }),

    // Create question (admin only)
    createQuestion: builder.mutation<Question, CreateQuestionRequest>({
      query: (data) => ({
        url: '/questions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Question'],
    }),

    // Update question (admin only)
    updateQuestion: builder.mutation<Question, { id: string; data: UpdateQuestionRequest }>({
      query: ({ id, data }) => ({
        url: `/questions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Question'],
    }),

    // Delete question (admin only)
    deleteQuestion: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Question'],
    }),

    // Bulk create questions (admin only)
    bulkCreateQuestions: builder.mutation<{ created: number; questions: Question[] }, CreateQuestionRequest[]>({
      query: (questions) => ({
        url: '/questions/bulk',
        method: 'POST',
        body: { questions },
      }),
      invalidatesTags: ['Question'],
    }),

    // Get question statistics (admin only)
    getQuestionStats: builder.query<{
      total: number;
      byLevel: Record<string, number>;
      byStep: Record<string, number>;
      byDifficulty: Record<string, number>;
    }, void>({
      query: () => '/questions/stats',
    }),
  }),
});

export const {
  useGetQuestionsQuery,
  useGetTestQuestionsQuery,
  useGetQuestionByIdQuery,
  useCreateQuestionMutation,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
  useBulkCreateQuestionsMutation,
  useGetQuestionStatsQuery,
} = questionApi;
