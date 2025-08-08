import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import './index.css';

// Components
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import TestPage from './pages/test/TestPage';
import TestHistory from './pages/test/TestHistory';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/AdminDashboard';

// Auth wrapper component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Simple auth check - in a real app, you'd check Redux state
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingSpinner />} persistor={persistor}>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Layout><Home /></Layout>} />
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/register" element={<Layout><Register /></Layout>} />
              
              {/* Protected routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout><Dashboard /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/test" element={
                <ProtectedRoute>
                  <Layout><TestPage /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/test/history" element={
                <ProtectedRoute>
                  <Layout><TestHistory /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout><Profile /></Layout>
                </ProtectedRoute>
              } />
              
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Layout><AdminDashboard /></Layout>
                </ProtectedRoute>
              } />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
