import React from 'react';
import './App.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './constants/routes';

const App: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default App;
