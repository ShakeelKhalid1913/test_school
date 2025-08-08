import React from 'react';

/**
 * Footer component
 * Simple footer with copyright and basic links
 */
const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-600">
            © 2025 Test School. All rights reserved.
          </div>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a 
              href="/privacy" 
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              Privacy Policy
            </a>
            <a 
              href="/terms" 
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              Terms of Service
            </a>
            <a 
              href="/contact" 
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
