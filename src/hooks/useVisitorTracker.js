import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { visitorService } from '../services/visitorService';

export const useVisitorTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Only track public patient pages, never admin portal
    if (!location.pathname.toLowerCase().startsWith('/admin')) {
      visitorService.trackVisitor(location.pathname);
    }
  }, [location.pathname]);
};

export default useVisitorTracker;

