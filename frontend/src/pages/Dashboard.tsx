import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Dashboard page component
 * Main user dashboard with overview and quick actions
 */
const Dashboard: React.FC = () => {
  // Mock user data - in real app, this would come from Redux store
  const user = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    currentLevel: 'A2',
    canTakeTest: true
  };

  const mockTestHistory = [
    { id: 1, step: 1, level: 'A2', score: 85, percentage: 85, date: '2025-08-01' },
    { id: 2, step: 2, level: 'B1', score: 75, percentage: 75, date: '2025-08-05' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user.firstName}!
        </h1>
        <p className="mt-2 text-gray-600">
          Track your progress and continue your digital competency journey.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  🎓
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Current Level</h3>
                <p className="text-2xl font-bold text-primary-600">
                  {user.currentLevel || 'Not started'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                  ✅
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Tests Completed</h3>
                <p className="text-2xl font-bold text-success-600">
                  {mockTestHistory.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                  📊
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Average Score</h3>
                <p className="text-2xl font-bold text-warning-600">
                  {mockTestHistory.length > 0 
                    ? Math.round(mockTestHistory.reduce((sum, test) => sum + test.percentage, 0) / mockTestHistory.length)
                    : 0}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          </div>
          <div className="card-body space-y-4">
            {user.canTakeTest ? (
              <Link 
                to="/test" 
                className="block w-full btn-primary text-center py-3"
              >
                Start New Assessment
              </Link>
            ) : (
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  You cannot retake assessments at this time.
                </p>
                <button 
                  disabled 
                  className="w-full btn-secondary opacity-50 cursor-not-allowed py-3"
                >
                  Assessment Unavailable
                </button>
              </div>
            )}
            
            <Link 
              to="/test/history" 
              className="block w-full btn-outline-primary text-center py-3"
            >
              View Test History
            </Link>
            
            <Link 
              to="/profile" 
              className="block w-full btn-outline-primary text-center py-3"
            >
              Update Profile
            </Link>
          </div>
        </div>

        {/* Recent Test History */}
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Recent Tests</h2>
          </div>
          <div className="card-body">
            {mockTestHistory.length > 0 ? (
              <div className="space-y-4">
                {mockTestHistory.slice(0, 3).map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        Step {test.step} Assessment
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(test.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {test.percentage}%
                      </p>
                      <span className={`level-${test.level}`}>
                        {test.level}
                      </span>
                    </div>
                  </div>
                ))}
                <Link 
                  to="/test/history" 
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  View all tests →
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  No test history yet
                </p>
                <Link 
                  to="/test" 
                  className="btn-primary"
                >
                  Take Your First Test
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Level Progress */}
      <div className="mt-8">
        <div className="card">
          <div className="card-header">
            <h2 className="text-xl font-semibold text-gray-900">Assessment Progress</h2>
          </div>
          <div className="card-body">
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-primary-600 font-bold">1</span>
                </div>
                <p className="text-sm font-medium">Step 1</p>
                <p className="text-xs text-gray-600">A1 & A2</p>
                <div className="mt-1">
                  {user.currentLevel && ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(user.currentLevel) ? (
                    <span className="text-success-600 text-xs">✅ Completed</span>
                  ) : (
                    <span className="text-gray-400 text-xs">Not started</span>
                  )}
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-success-600 font-bold">2</span>
                </div>
                <p className="text-sm font-medium">Step 2</p>
                <p className="text-xs text-gray-600">B1 & B2</p>
                <div className="mt-1">
                  {user.currentLevel && ['B1', 'B2', 'C1', 'C2'].includes(user.currentLevel) ? (
                    <span className="text-success-600 text-xs">✅ Completed</span>
                  ) : user.currentLevel === 'A2' ? (
                    <span className="text-warning-600 text-xs">📋 Available</span>
                  ) : (
                    <span className="text-gray-400 text-xs">Locked</span>
                  )}
                </div>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mb-2">
                  <span className="text-warning-600 font-bold">3</span>
                </div>
                <p className="text-sm font-medium">Step 3</p>
                <p className="text-xs text-gray-600">C1 & C2</p>
                <div className="mt-1">
                  {user.currentLevel && ['C1', 'C2'].includes(user.currentLevel) ? (
                    <span className="text-success-600 text-xs">✅ Completed</span>
                  ) : user.currentLevel === 'B2' ? (
                    <span className="text-warning-600 text-xs">📋 Available</span>
                  ) : (
                    <span className="text-gray-400 text-xs">Locked</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
