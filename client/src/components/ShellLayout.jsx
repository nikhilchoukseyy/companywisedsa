import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import AppDrawer from './AppDrawer';
import Footer from './Footer';

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
        <Outlet context={outletContext} />
      </main>

      <Footer />
    </div>
  );
}
