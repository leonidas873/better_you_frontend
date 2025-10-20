import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ROUTE_CONFIG } from '../constants/routes';

export const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const route = ROUTE_CONFIG.find(
      (r: { path: string; title: string }) => r.path === path
    );

    if (route) {
      document.title = `${route.title} - Better You`;
    } else {
      document.title = 'Better You';
    }
  }, [location.pathname]);
};
