import React from 'react';
import { Link } from 'react-router-dom';

interface TestResult {
  id: string;
  step: number;
  level: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  timeTaken: number; // in seconds
  date: string;
  status: 'completed' | 'failed' | 'in_progress';
}

/**
 * Test history page component
 * Displays user's assessment history and results
 */
const TestHistory: React.FC = () => {
  // Mock test history data - in real app, this would come from API
  const testHistory: TestResult[] = [
    {
      id: '1',
      step: 1,
      level: 'A2',
      score: 17,
      totalQuestions: 20,
      percentage: 85,
      timeTaken: 1200, // 20 minutes
      date: '2025-01-15T10:30:00Z',
      status: 'completed'
    },
    {
      id: '2',
      step: 2,
      level: 'B1',
      score: 15,
      totalQuestions: 20,
      percentage: 75,
      timeTaken: 1500, // 25 minutes
      date: '2025-01-10T14:15:00Z',
      status: 'completed'
    },
    {
      id: '3',
      step: 1,
      level: 'A1',
      score: 12,
      totalQuestions: 20,
      percentage: 60,
      timeTaken: 900, // 15 minutes
      date: '2025-01-05T09:45:00Z',
      status: 'failed'
    }
  ];

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes === 0) {
      return `${remainingSeconds}s`;
    }
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-success">Completed</span>;
      case 'failed':
        return <span className="badge badge-error">Failed</span>;
      case 'in_progress':
        return <span className="badge badge-warning">In Progress</span>;
      default:
        return <span className="badge badge-gray">Unknown</span>;
    }
  };

  const getLevelBadge = (level: string) => {
    return <span className={`level-${level}`}>{level}</span>;
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success-600';
    if (percentage >= 60) return 'text-warning-600';
    return 'text-error-600';
  };

  // Calculate statistics
  const completedTests = testHistory.filter(test => test.status === 'completed');
  const averageScore = completedTests.length > 0 
    ? Math.round(completedTests.reduce((sum, test) => sum + test.percentage, 0) / completedTests.length)
    : 0;
  const bestScore = completedTests.length > 0 
    ? Math.max(...completedTests.map(test => test.percentage))
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test History</h1>
          <p className="mt-2 text-gray-600">
            View your assessment results and track your progress over time.
          </p>
        </div>
        <Link 
          to="/test" 
          className="btn-primary"
        >
          Take New Test
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {testHistory.length}
            </div>
            <div className="text-sm text-gray-600">Total Tests</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-success-600 mb-1">
              {completedTests.length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-warning-600 mb-1">
              {averageScore}%
            </div>
            <div className="text-sm text-gray-600">Average Score</div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-success-600 mb-1">
              {bestScore}%
            </div>
            <div className="text-sm text-gray-600">Best Score</div>
          </div>
        </div>
      </div>

      {/* Test History Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-gray-900">Assessment History</h2>
        </div>
        <div className="card-body p-0">
          {testHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Test Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time Taken
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {testHistory.map((test) => (
                    <tr key={test.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            Step {test.step} Assessment
                          </div>
                          <div className="flex items-center mt-1">
                            {getLevelBadge(test.level)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className={`text-sm font-medium ${getScoreColor(test.percentage)}`}>
                            {test.percentage}%
                          </div>
                          <div className="text-xs text-gray-500">
                            {test.score}/{test.totalQuestions} correct
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatTime(test.timeTaken)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(test.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(test.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                  <span className="text-gray-400 text-2xl">📊</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No test history yet
              </h3>
              <p className="text-gray-600 mb-6">
                Take your first assessment to see your results here.
              </p>
              <Link 
                to="/test" 
                className="btn-primary"
              >
                Start Your First Test
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Progress Chart Placeholder */}
      {testHistory.length > 0 && (
        <div className="mt-8">
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold text-gray-900">Progress Over Time</h2>
            </div>
            <div className="card-body">
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="mb-4">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-primary-600 text-2xl">📈</span>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Progress Chart
                </h3>
                <p className="text-gray-600">
                  Visual progress tracking will be available soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestHistory;
