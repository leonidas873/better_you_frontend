import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTE_CONFIG } from '../constants/routes';
import Layout from './layout/Layout';

const Router: React.FC = () => {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          {ROUTE_CONFIG.map(route => {
            const Component = route.component;
            return (
              <Route
                key={route.path}
                path={`${route.path}/*`}
                element={<Component />}
              />
            );
          })}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
};

export default Router;
