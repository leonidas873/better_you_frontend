// Utility functions for the application

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

export const cn = (
  ...classes: (string | undefined | null | false)[]
): string => {
  return classes.filter(Boolean).join(' ');
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Route management utilities
import { ROUTE_CONFIG } from '../constants/routes';

export const getRouteConfig = (path: string) => {
  return ROUTE_CONFIG.find(route => route.path === path);
};

export const getProtectedRoutes = () => {
  return ROUTE_CONFIG.filter(route => route.protected).map(route => route.path);
};

export const getPublicRoutes = () => {
  return ROUTE_CONFIG.filter(route => !route.protected).map(
    route => route.path
  );
};

export const getRouteTitle = (path: string) => {
  const config = ROUTE_CONFIG.find(route => route.path === path);
  return config?.title || 'Unknown Page';
};
