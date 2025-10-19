import React from 'react';
import { Outlet } from 'react-router-dom';

const TherapistDashboard: React.FC = () => {
  return (
    <div>
      TherapistDashboard <Outlet />
    </div>
  );
};

export default TherapistDashboard;
