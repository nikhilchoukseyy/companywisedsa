import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackAdminPage, trackNavigation } from '../utils/analytics';

function buildPath(location) {
  return `${location.pathname}${location.search || ''}`;
}

export default function RouteAnalytics() {
  const location = useLocation();
  const previousPathRef = useRef('');

  useEffect(() => {
    const nextPath = buildPath(location);
    const previousPath = previousPathRef.current || document.referrer || 'direct';

    trackNavigation(previousPath, nextPath, {
      pathname: location.pathname,
      search: location.search || '',
      hash: location.hash || '',
    });

    if (location.pathname.startsWith('/admin')) {
      trackAdminPage(location.pathname, {
        pathname: location.pathname,
      });
    }

    previousPathRef.current = nextPath;
  }, [location]);

  return null;
}
