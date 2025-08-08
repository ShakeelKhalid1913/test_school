import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Home page component
 * Landing page with platform overview and call-to-action
 */
const Home: React.FC = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Test Your <span className="text-gradient">Digital Competency</span>
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
            Master digital skills through our comprehensive 3-step assessment platform. 
            Earn certificates from A1 to C2 levels and advance your digital career.
          </p>
          <div className="mt-10 flex justify-center space-x-4">
            <Link to="/register" className="btn-primary px-8 py-3">
              Get Started
            </Link>
            <Link to="/login" className="btn-outline-primary px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Complete our 3-step progressive assessment system
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary-600 font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Step 1: A1 & A2 Levels
                </h3>
                <p className="text-gray-600">
                  Start with basic digital literacy assessment. Score 75% or higher to proceed to Step 2.
                </p>
                <div className="mt-4 space-y-1 text-sm">
                  <div>• &lt;25%: No retake allowed</div>
                  <div>• 25-49%: A1 Certificate</div>
                  <div>• 50-74%: A2 Certificate</div>
                  <div>• ≥75%: Proceed to Step 2</div>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="card">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-success-600 font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Step 2: B1 & B2 Levels
                </h3>
                <p className="text-gray-600">
                  Intermediate digital skills assessment. Advance your competency level further.
                </p>
                <div className="mt-4 space-y-1 text-sm">
                  <div>• &lt;25%: Remain at A2</div>
                  <div>• 25-49%: B1 Certificate</div>
                  <div>• 50-74%: B2 Certificate</div>
                  <div>• ≥75%: Proceed to Step 3</div>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="card">
              <div className="card-body text-center">
                <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-warning-600 font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Step 3: C1 & C2 Levels
                </h3>
                <p className="text-gray-600">
                  Advanced digital competency assessment. Achieve the highest certification levels.
                </p>
                <div className="mt-4 space-y-1 text-sm">
                  <div>• &lt;25%: Remain at B2</div>
                  <div>• 25-49%: C1 Certificate</div>
                  <div>• ≥50%: C2 Certificate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Platform Features
            </h2>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                ⏱️
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Timed Assessments
              </h3>
              <p className="text-gray-600 text-sm">
                1 minute per question with auto-submit functionality
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🎓
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Digital Certificates
              </h3>
              <p className="text-gray-600 text-sm">
                Automatic certificate generation based on your performance
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🔒
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Secure Testing
              </h3>
              <p className="text-gray-600 text-sm">
                Secure authentication and test integrity measures
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-danger-100 rounded-full flex items-center justify-center mx-auto mb-4">
                📊
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Progress Tracking
              </h3>
              <p className="text-gray-600 text-sm">
                Monitor your assessment history and achievement levels
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Ready to Test Your Digital Skills?
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Join thousands of learners who have advanced their digital competency with Test School.
          </p>
          <div className="mt-8">
            <Link to="/register" className="btn-primary px-8 py-3">
              Start Your Assessment
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
