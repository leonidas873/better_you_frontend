import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import NotFoundPage from '../pages/NotFoundPage';

// Routes configuration array - single source of truth
export const ROUTE_CONFIG = [
  {
    path: '/',
    component: HomePage,
    title: 'Home',
    protected: false,
  },
  {
    path: '/login',
    component: LoginPage,
    title: 'Login',
    protected: false,
  },
  {
    path: '/register',
    component: RegisterPage,
    title: 'Register',
    protected: false,
  },
  {
    path: '*',
    component: NotFoundPage,
    title: 'Page Not Found',
    protected: false,
  },
] as const;
