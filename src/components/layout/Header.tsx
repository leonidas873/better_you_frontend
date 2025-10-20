import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import logo from '../../assets/logo.svg';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <img src={logo} alt="Better You" className="h-32 w-auto" />
            </Link>
          </div>

          {/* Navigation and Action Buttons */}
          <div className="flex items-center space-x-4">
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link to="/register">Register</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/apply">Apply</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
