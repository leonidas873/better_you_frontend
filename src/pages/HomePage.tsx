import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to Better You
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Your journey to personal growth and self-improvement starts here
        </p>
        <div className="space-x-4">
          <Link
            to="/dashboard"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/about"
            className="inline-block bg-gray-200 text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
