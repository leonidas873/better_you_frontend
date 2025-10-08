import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.svg';

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Better You" className="h-32" />
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/login"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/login')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/register')
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Register
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
