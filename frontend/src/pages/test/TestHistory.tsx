import React from 'react';
import { useNavigate } from 'react-router-dom';

interface TestHistoryItem {
  id: string;
  date: string;
  level: string;
  score: number;
  totalQuestions: number;
  passed: boolean;
  timeTaken: string;
}

/**
 * Test history page component
 * Shows user's previous test attempts and results
 */
const TestHistory: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock test history data - in real app, this would come from API
  const testHistory: TestHistoryItem[] = [
    {
      id: '1',
      date: '2024-01-15',
      level: 'A1',
      score: 8,
      totalQuestions: 10,
      passed: true,
      timeTaken: '15:30'
    },
    {
      id: '2',
      date: '2024-01-20',
      level: 'A2',
      score: 6,
      totalQuestions: 10,
      passed: false,
      timeTaken: '18:45'
    },
    {
      id: '3',
      date: '2024-01-25',
      level: 'A2',
      score: 9,
      totalQuestions: 10,
      passed: true,
      timeTaken: '16:20'
    }
  ];

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-success-600';
    if (percentage >= 60) return 'text-warning-600';
    return 'text-error-600';
  };

  const getStatusBadge = (passed: boolean) => {
    return passed 
      ? 'bg-success-100 text-success-800' 
      : 'bg-error-100 text-error-800';
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Test History</h1>
          <p className="text-gray-600 mt-2">
            View your previous test attempts and results
          </p>
        </div>
        
        <button
          onClick={() => navigate('/dashboard')}
          className="btn-outline-primary"
        >
          Back to Dashboard
        </button>
      </div>

      {testHistory.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Test History
            </h3>
            <p className="text-gray-600 mb-6">
              You haven't taken any tests yet. Start your first assessment to see your results here.
            </p>
            <button
              onClick={() => navigate('/test')}
              className="btn-primary"
            >
              Take First Test
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card">
              <div className="card-body text-center">
                <p className="text-2xl font-bold text-primary-600">
                  {testHistory.length}
                </p>
                <p className="text-gray-600">Total Tests</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body text-center">
                <p className="text-2xl font-bold text-success-600">
                  {testHistory.filter(test => test.passed).length}
                </p>
                <p className="text-gray-600">Passed</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body text-center">
                <p className="text-2xl font-bold text-error-600">
                  {testHistory.filter(test => !test.passed).length}
                </p>
                <p className="text-gray-600">Failed</p>
              </div>
            </div>
            
            <div className="card">
              <div className="card-body text-center">
                <p className="text-2xl font-bold text-primary-600">
                  {Math.max(...testHistory.map(test => test.level === 'A1' ? 1 : test.level === 'A2' ? 2 : test.level === 'B1' ? 3 : test.level === 'B2' ? 4 : test.level === 'C1' ? 5 : 6))}
                </p>
                <p className="text-gray-600">Highest Level</p>
              </div>
            </div>
          </div>

          {/* Test History Table */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-xl font-semibold">Test Results</h2>
            </div>
            <div className="card-body p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time Taken
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
                    {testHistory.map((test) => (
                      <tr key={test.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(test.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                            {test.level}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`font-semibold ${getScoreColor(test.score, test.totalQuestions)}`}>
                            {test.score}/{test.totalQuestions}
                          </span>
                          <span className="text-gray-500 ml-2">
                            ({Math.round((test.score / test.totalQuestions) * 100)}%)
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {test.timeTaken}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(test.passed)}`}>
                            {test.passed ? 'Passed' : 'Failed'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-primary-600 hover:text-primary-900 mr-4">
                            View Details
                          </button>
                          {!test.passed && (
                            <button
                              onClick={() => navigate('/test')}
                              className="text-success-600 hover:text-success-900"
                            >
                              Retake
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => navigate('/test')}
              className="btn-primary"
            >
              Take New Test
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TestHistory;
