import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  step: number;
  level: string;
}

interface TestState {
  step: number;
  level: string;
  currentQuestionIndex: number;
  answers: number[];
  timeRemaining: number;
  isSubmitted: boolean;
}

/**
 * Test page component
 * Handles the assessment test interface with timer and questions
 */
const TestPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Mock questions data - in real app, this would come from API
  const mockQuestions: Question[] = [
    {
      id: '1',
      text: 'What is the most basic component of a computer system?',
      options: ['Software', 'Hardware', 'Data', 'Network'],
      correctAnswer: 1,
      step: 1,
      level: 'A1'
    },
    {
      id: '2',
      text: 'Which of the following is an input device?',
      options: ['Monitor', 'Printer', 'Keyboard', 'Speaker'],
      correctAnswer: 2,
      step: 1,
      level: 'A1'
    },
    {
      id: '3',
      text: 'What does CPU stand for?',
      options: ['Computer Personal Unit', 'Central Processing Unit', 'Control Program Unit', 'Central Program Utility'],
      correctAnswer: 1,
      step: 1,
      level: 'A1'
    },
    {
      id: '4',
      text: 'Which file extension is typically used for images?',
      options: ['.txt', '.doc', '.jpg', '.exe'],
      correctAnswer: 2,
      step: 1,
      level: 'A1'
    },
    {
      id: '5',
      text: 'What is the purpose of an operating system?',
      options: ['To create documents', 'To manage computer resources', 'To browse the internet', 'To play games'],
      correctAnswer: 1,
      step: 1,
      level: 'A1'
    }
  ];

  const [testState, setTestState] = useState<TestState>({
    step: 1,
    level: 'A1',
    currentQuestionIndex: 0,
    answers: new Array(mockQuestions.length).fill(-1),
    timeRemaining: 30 * 60, // 30 minutes in seconds
    isSubmitted: false
  });

  // Timer effect
  useEffect(() => {
    if (testState.timeRemaining > 0 && !testState.isSubmitted) {
      const timer = setTimeout(() => {
        setTestState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);

      return () => clearTimeout(timer);
    } else if (testState.timeRemaining === 0 && !testState.isSubmitted) {
      // Auto-submit when time runs out
      handleSubmitTest();
    }
  }, [testState.timeRemaining, testState.isSubmitted]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (testState.isSubmitted) return;

    const newAnswers = [...testState.answers];
    newAnswers[testState.currentQuestionIndex] = answerIndex;
    
    setTestState(prev => ({
      ...prev,
      answers: newAnswers
    }));
  };

  const handlePreviousQuestion = () => {
    if (testState.currentQuestionIndex > 0) {
      setTestState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      }));
    }
  };

  const handleNextQuestion = () => {
    if (testState.currentQuestionIndex < mockQuestions.length - 1) {
      setTestState(prev => ({
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  const handleSubmitTest = () => {
    // Calculate score
    let correctAnswers = 0;
    mockQuestions.forEach((question, index) => {
      if (testState.answers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = correctAnswers;
    const percentage = Math.round((correctAnswers / mockQuestions.length) * 100);

    setTestState(prev => ({
      ...prev,
      isSubmitted: true
    }));

    // In real app, submit to API here
    console.log('Test submitted:', {
      score,
      percentage,
      answers: testState.answers,
      timeSpent: 30 * 60 - testState.timeRemaining
    });

    // Navigate to results or dashboard after a delay
    setTimeout(() => {
      navigate('/dashboard');
    }, 5000);
  };

  const currentQuestion = mockQuestions[testState.currentQuestionIndex];
  const answeredQuestions = testState.answers.filter(answer => answer !== -1).length;
  const progress = (answeredQuestions / mockQuestions.length) * 100;

  if (testState.isSubmitted) {
    const correctAnswers = mockQuestions.reduce((count, question, index) => {
      return count + (testState.answers[index] === question.correctAnswer ? 1 : 0);
    }, 0);
    const percentage = Math.round((correctAnswers / mockQuestions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card text-center">
          <div className="card-body py-12">
            <div className="mb-6">
              <div className="w-20 h-20 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎉</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Test Completed!
              </h1>
              <p className="text-gray-600">
                Thank you for completing the assessment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary-600">{correctAnswers}</p>
                <p className="text-gray-600">Correct Answers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-success-600">{percentage}%</p>
                <p className="text-gray-600">Score</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-warning-600">
                  {formatTime(30 * 60 - testState.timeRemaining)}
                </p>
                <p className="text-gray-600">Time Taken</p>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                You will be redirected to your dashboard shortly...
              </p>
              <button 
                onClick={() => navigate('/dashboard')}
                className="btn-primary"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Step {testState.step} Assessment
          </h1>
          <p className="text-gray-600">
            Level: {testState.level}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <p className="text-sm text-gray-600">Time remaining</p>
            <p className={`text-xl font-bold ${
              testState.timeRemaining < 300 ? 'text-error-600' : 'text-primary-600'
            }`}>
              {formatTime(testState.timeRemaining)}
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Question {testState.currentQuestionIndex + 1} of {mockQuestions.length}
          </span>
          <span className="text-sm font-medium text-gray-700">
            {answeredQuestions} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Question Navigation */}
        <div className="lg:col-span-1">
          <div className="card sticky top-8">
            <div className="card-header">
              <h3 className="text-lg font-semibold">Questions</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-5 lg:grid-cols-1 gap-2">
                {mockQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setTestState(prev => ({ ...prev, currentQuestionIndex: index }))}
                    className={`p-2 text-sm rounded transition-colors ${
                      index === testState.currentQuestionIndex
                        ? 'bg-primary-600 text-white'
                        : testState.answers[index] !== -1
                        ? 'bg-success-100 text-success-700'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="lg:col-span-3">
          <div className="card">
            <div className="card-body">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  {currentQuestion.text}
                </h2>
                
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                        testState.answers[testState.currentQuestionIndex] === index
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-current mr-3 flex items-center justify-center">
                          {testState.answers[testState.currentQuestionIndex] === index && (
                            <div className="w-3 h-3 rounded-full bg-current"></div>
                          )}
                        </span>
                        <span>{option}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between pt-6 border-t">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={testState.currentQuestionIndex === 0}
                  className="btn-outline-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <div className="flex items-center space-x-4">
                  {testState.currentQuestionIndex === mockQuestions.length - 1 ? (
                    <button
                      onClick={handleSubmitTest}
                      className="btn-success"
                    >
                      Submit Test
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="btn-primary"
                    >
                      Next
                    </button>
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

export default TestPage;
