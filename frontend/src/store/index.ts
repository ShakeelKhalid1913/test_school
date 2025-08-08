import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';
import { authApi } from '../services/authApi';
import { testApi } from '../services/testApi';
import { userApi } from '../services/userApi';
import { questionApi } from '../services/questionApi';
import authReducer from './slices/authSlice';
import testReducer from './slices/testSlice';
import userReducer from './slices/userSlice';
import questionReducer from './slices/questionSlice';

/**
 * Root reducer combining all feature reducers
 */
const rootReducer = combineReducers({
  auth: authReducer,
  test: testReducer,
  user: userReducer,
  question: questionReducer,
  // RTK Query API reducers
  [authApi.reducerPath]: authApi.reducer,
  [testApi.reducerPath]: testApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [questionApi.reducerPath]: questionApi.reducer,
});

/**
 * Redux persist configuration
 * Persists auth state to localStorage for session management
 */
const persistConfig = {
  key: 'test-school',
  storage,
  whitelist: ['auth'], // Only persist auth state
  blacklist: ['test', 'user', 'question'], // Don't persist these states
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Configure Redux store with RTK Query, persistence, and middleware
 */
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
      .concat(authApi.middleware)
      .concat(testApi.middleware)
      .concat(userApi.middleware)
      .concat(questionApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

/**
 * Redux persistor for persistence functionality
 */
export const persistor = persistStore(store);

/**
 * Type definitions for TypeScript support
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Clear all persisted data (used for logout)
 */
export const clearPersistedData = () => {
  persistor.purge();
};
