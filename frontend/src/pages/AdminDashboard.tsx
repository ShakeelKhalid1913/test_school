import React, { useState } from 'react';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user';
  currentLevel: string;
  joinedDate: string;
  lastTestDate: string;
  isActive: boolean;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  step: number;
  level: string;
  isActive: boolean;
}

/**
 * Admin dashboard component
 * Administrative interface for managing users and questions
 */
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'questions'>('overview');

  // Mock data - in real app, this would come from API
  const mockUsers: User[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'user',
      currentLevel: 'A2',
      joinedDate: '2025-01-01',
      lastTestDate: '2025-01-15',
      isActive: true
    },
    {
      id: '2',
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      role: 'user',
      currentLevel: 'B1',
      joinedDate: '2024-12-15',
      lastTestDate: '2025-01-10',
      isActive: true
    },
    {
      id: '3',
      firstName: 'Bob',
      lastName: 'Johnson',
      email: 'bob.johnson@example.com',
      role: 'user',
      currentLevel: 'A1',
      joinedDate: '2024-11-20',
      lastTestDate: '2024-12-05',
      isActive: false
    }
  ];

  const mockQuestions: Question[] = [
    {
      id: '1',
      text: 'What is the most basic component of a computer system?',
      options: ['Software', 'Hardware', 'Data', 'Network'],
      correctAnswer: 1,
      step: 1,
      level: 'A1',
      isActive: true
    },
    {
      id: '2',
      text: 'Which of the following is an input device?',
      options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'],
      correctAnswer: 2,
      step: 1,
      level: 'A1',
      isActive: true
    }
  ];

  const stats = {
    totalUsers: mockUsers.length,
    activeUsers: mockUsers.filter(user => user.isActive).length,
    totalQuestions: mockQuestions.length,
    activeQuestions: mockQuestions.filter(q => q.isActive).length,
    testsThisWeek: 15,
    averageScore: 78
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleUserToggle = (userId: string) => {
    console.log('Toggle user status:', userId);
    // In real app, call API to toggle user status
  };

  const handleQuestionToggle = (questionId: string) => {
    console.log('Toggle question status:', questionId);
    // In real app, call API to toggle question status
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {stats.totalUsers}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-success-600 mb-1">
              {stats.activeUsers}
            </div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-warning-600 mb-1">
              {stats.totalQuestions}
            </div>
            <div className="text-sm text-gray-600">Total Questions</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-info-600 mb-1">
              {stats.activeQuestions}
            </div>
            <div className="text-sm text-gray-600">Active Questions</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {stats.testsThisWeek}
            </div>
            <div className="text-sm text-gray-600">Tests This Week</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-pink-600 mb-1">
              {stats.averageScore}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        </div>
        <div className="card-body">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                <span className="text-success-600 text-sm">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  John Doe completed Step 1 Assessment
                </p>
                <p className="text-xs text-gray-600">2 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 text-sm">+</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New user Jane Smith registered
                </p>
                <p className="text-xs text-gray-600">4 hours ago</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                <span className="text-warning-600 text-sm">?</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  New question added to A1 level
                </p>
                <p className="text-xs text-gray-600">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          <button className="btn-primary">Add New User</button>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Test
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`level-${user.currentLevel}`}>
                      {user.currentLevel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(user.lastTestDate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${user.isActive ? 'badge-success' : 'badge-error'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleUserToggle(user.id)}
                      className={`${user.isActive ? 'text-error-600 hover:text-error-700' : 'text-success-600 hover:text-success-700'}`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="text-primary-600 hover:text-primary-700">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderQuestions = () => (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Question Management</h2>
          <button className="btn-primary">Add New Question</button>
        </div>
      </div>
      <div className="card-body p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Question
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Step
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockQuestions.map((question) => (
                <tr key={question.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-md">
                      {question.text}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    Step {question.step}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`level-${question.level}`}>
                      {question.level}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`badge ${question.isActive ? 'badge-success' : 'badge-error'}`}>
                      {question.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleQuestionToggle(question.id)}
                      className={`${question.isActive ? 'text-error-600 hover:text-error-700' : 'text-success-600 hover:text-success-700'}`}
                    >
                      {question.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button className="text-primary-600 hover:text-primary-700">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage users, questions, and monitor system activity.
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'users'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Users ({stats.totalUsers})
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'questions'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Questions ({stats.totalQuestions})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && renderOverview()}
      {activeTab === 'users' && renderUsers()}
      {activeTab === 'questions' && renderQuestions()}
    </div>
  );
};

export default AdminDashboard;
