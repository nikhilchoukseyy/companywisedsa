import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import AppDrawer from './AppDrawer';
import Footer from './Footer';
import AppErrorBoundary from './AppErrorBoundary';
import RouteAnalytics from './RouteAnalytics';

export default function ShellLayout({
  drawerOpen,
  setDrawerOpen,
  onGoogleLogin,
  onGoogleError,
  onLogout,
  user,
  outletContext,
}) {
  const location = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname, setDrawerOpen]);

  useEffect(() => {
    if (!location.hash) {
      return undefined;
    }

    const frame = window.requestAnimationFrame(() => {
      const targetId = decodeURIComponent(location.hash.slice(1));
      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [location.hash]);

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-page text-text-primary">
      <AppNavbar
        onMenuClick={() => setDrawerOpen(true)}
        onGoogleLogin={onGoogleLogin}
        onGoogleError={onGoogleError}
        onLogout={onLogout}
        user={user}
      />

      <AppDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onGoogleLogin={onGoogleLogin}
        onGoogleError={onGoogleError}
        onLogout={onLogout}
        user={user}
      />

      <main className="flex-1 overflow-x-hidden">
        <RouteAnalytics />
        <AppErrorBoundary>
          <Outlet context={outletContext} />
        </AppErrorBoundary>
      </main>

      <Footer />
    </div>
  );
}
