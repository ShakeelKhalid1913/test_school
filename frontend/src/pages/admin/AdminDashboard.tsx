import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  currentLevel: string;
  testsCompleted: number;
  lastTestDate: string;
  isVerified: boolean;
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  step: number;
  level: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface TestSession {
  id: string;
  userId: string;
  userEmail: string;
  step: number;
  level: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  startTime: string;
  endTime: string;
  answers: number[];
}

/**
 * Admin dashboard component
 * Provides admin functionality for managing users, questions, and viewing test results
 */
const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'questions' | 'tests'>('users');

  // Mock data - in real app, this would come from API
  const users: User[] = [
    {
      id: '1',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      currentLevel: 'A2',
      testsCompleted: 3,
      lastTestDate: '2024-01-25',
      isVerified: true
    },
    {
      id: '2',
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      currentLevel: 'B1',
      testsCompleted: 5,
      lastTestDate: '2024-01-24',
      isVerified: true
    },
    {
      id: '3',
      email: 'bob.wilson@example.com',
      firstName: 'Bob',
      lastName: 'Wilson',
      currentLevel: 'A1',
      testsCompleted: 1,
      lastTestDate: '2024-01-23',
      isVerified: false
    }
  ];

  const questions: Question[] = [
    {
      id: '1',
      text: 'What is the most basic component of a computer system?',
      options: ['Software', 'Hardware', 'Data', 'Network'],
      correctAnswer: 1,
      step: 1,
      level: 'A1',
      difficulty: 'easy'
    },
    {
      id: '2',
      text: 'Which of the following is an input device?',
      options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'],
      correctAnswer: 2,
      step: 1,
      level: 'A1',
      difficulty: 'easy'
    },
    {
      id: '3',
      text: 'What is the purpose of a database management system?',
      options: ['To create websites', 'To manage and organize data', 'To design graphics', 'To write code'],
      correctAnswer: 1,
      step: 2,
      level: 'B1',
      difficulty: 'medium'
    }
  ];

  const testSessions: TestSession[] = [
    {
      id: '1',
      userId: '1',
      userEmail: 'john.doe@example.com',
      step: 1,
      level: 'A1',
      score: 8,
      totalQuestions: 10,
      passed: true,
      startTime: '2024-01-25T10:00:00Z',
      endTime: '2024-01-25T10:15:30Z',
      answers: [1, 2, 0, 1, 3, 2, 1, 0, 2, 1]
    },
    {
      id: '2',
      userId: '2',
      userEmail: 'jane.smith@example.com',
      step: 2,
      level: 'B1',
      score: 7,
      totalQuestions: 10,
      passed: true,
      startTime: '2024-01-24T14:30:00Z',
      endTime: '2024-01-24T14:48:15Z',
      answers: [2, 1, 1, 0, 2, 3, 1, 2, 0, 1]
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success-100 text-success-800';
      case 'medium': return 'bg-warning-100 text-warning-800';
      case 'hard': return 'bg-error-100 text-error-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (passed: boolean) => {
    return passed 
      ? 'bg-success-100 text-success-800' 
      : 'bg-error-100 text-error-800';
  };

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">User Management</h2>
        <button className="btn-primary">
          Add New User
        </button>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tests Completed
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
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {user.currentLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {user.testsCompleted}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(user.lastTestDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.isVerified 
                          ? 'bg-success-100 text-success-800' 
                          : 'bg-warning-100 text-warning-800'
                      }`}>
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        View
                      </button>
                      <button className="text-warning-600 hover:text-warning-900">
                        Edit
                      </button>
                      <button className="text-error-600 hover:text-error-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderQuestionsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Question Management</h2>
        <button className="btn-primary">
          Add New Question
        </button>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Step
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Difficulty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {questions.map((question) => (
                  <tr key={question.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-md truncate">
                        {question.text}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {question.options.length} options
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {question.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {question.step}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                        {question.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button className="text-primary-600 hover:text-primary-900">
                        View
                      </button>
                      <button className="text-warning-600 hover:text-warning-900">
                        Edit
                      </button>
                      <button className="text-error-600 hover:text-error-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTestsTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Test Sessions</h2>
        <button className="btn-outline-primary">
          Export Results
        </button>
      </div>

      <div className="card">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testSessions.map((session) => {
                  const duration = Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 60000);
                  return (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.userEmail}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                          {session.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="font-semibold">
                          {session.score}/{session.totalQuestions}
                        </span>
                        <span className="text-gray-500 ml-2">
                          ({Math.round((session.score / session.totalQuestions) * 100)}%)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.passed)}`}>
                          {session.passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(session.startTime).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {duration} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-primary-600 hover:text-primary-900">
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage users, questions, and view test results
          </p>
        </div>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-outline-primary"
        >
          Back to Dashboard
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body text-center">
            <p className="text-2xl font-bold text-primary-600">{users.length}</p>
            <p className="text-gray-600">Total Users</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <p className="text-2xl font-bold text-success-600">{questions.length}</p>
            <p className="text-gray-600">Questions</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <p className="text-2xl font-bold text-warning-600">{testSessions.length}</p>
            <p className="text-gray-600">Test Sessions</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body text-center">
            <p className="text-2xl font-bold text-error-600">
              {Math.round(testSessions.filter(s => s.passed).length / testSessions.length * 100)}%
            </p>
            <p className="text-gray-600">Pass Rate</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {[
            { key: 'users', label: 'Users' },
            { key: 'questions', label: 'Questions' },
            { key: 'tests', label: 'Test Sessions' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as typeof activeTab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === key
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && renderUsersTab()}
      {activeTab === 'questions' && renderQuestionsTab()}
      {activeTab === 'tests' && renderTestsTab()}
    </div>
  );
};

export default AdminDashboard;
