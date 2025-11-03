import HomePage from '../pages/HomePage/HomePage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import ApplyPage from '../pages/ApplyPage';
import Layout from '../components/layout/Layout';
import ClientDashboard from '../pages/ClientDashboard/ClientDashboard';
import TherapistDashboard from '../pages/TherapistDashboard/TherapistDashboard';
import RegisterPage from '../pages/RegisterPage/RegisterPage';
import { createBrowserRouter, redirect } from 'react-router-dom';

export const ROUTE_CONFIG = [
  { path: '/', title: 'Home', protected: false },
  { path: '/login', title: 'Login', protected: false },
  { path: '/register', title: 'Register', protected: false },
  { path: '/apply', title: 'Apply', protected: false },
  {
    path: '/therapist-dashboard',
    title: 'Therapist Dashboard',
    protected: true,
  },
  { path: '/client-dashboard', title: 'Client Dashboard', protected: true },
];

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'apply',
        element: <ApplyPage />,
      },
    ],
  },
  {
    path: '/therapist-dashboard',
    element: <TherapistDashboard />,
    middleware: [loggingMiddleware],
    children: [
      {
        path: 'dashboard',
        element: <h1>protected</h1>,
      },
    ],
  },
  {
    path: '/client-dashboard',
    element: <ClientDashboard />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

async function loggingMiddleware(
  { request }: { request: Request },
  next: () => Promise<unknown>
) {
  const url = new URL(request.url);
  console.log(`Starting navigation: ${url.pathname}${url.search}`);
  const start = performance.now();
  await next();
  const duration = performance.now() - start;
  console.log(`Navigation completed in ${duration}ms`);
  throw redirect('/login');
}
