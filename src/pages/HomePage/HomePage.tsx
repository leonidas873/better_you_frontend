import React from 'react';
import { Link } from 'react-router-dom';
import { HeroSection } from './components/hero';
import { heroQuotes, heroImageData } from './heroData';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section - First Section */}
      <HeroSection quotes={heroQuotes} heroImage={heroImageData} />
      {/* Additional Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Welcome to Better You
          </h2>
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
      </section>
    </div>
  );
};

export default HomePage;
