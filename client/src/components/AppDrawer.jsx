import { useEffect } from 'react';
import { X, Home, Building2, UserCircle2, Bookmark, Settings, LogOut, MoonStar, SunMedium } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

const navItems = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Companies', to: '/companies', icon: Building2 },
  { label: 'Profile', to: '/profile', icon: UserCircle2 },
  { label: 'Bookmarks', to: '/bookmarks', icon: Bookmark },
  { label: 'Settings', to: '/settings', icon: Settings },
];

function navLinkClassName({ isActive }) {
  return `drawer-link ${isActive ? 'is-active' : ''}`;
}

export default function AppDrawer({
  open,
  onClose,
  theme,
  onThemeToggle,
  onGoogleLogin,
  onGoogleError,
  onLogout,
  user,
}) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === 'Escape') {
        onClose?.();
      }
    }

    if (open) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  return (
    <>
      <button
        type="button"
        className={`drawer-backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-label="Close menu overlay"
      />

      <aside className={`mobile-drawer ${open ? 'is-open' : ''}`} aria-hidden={!open}>
        <div className="drawer-top">
          <div>
            <div className="drawer-eyebrow">Navigation</div>
            <strong>DSA Prep</strong>
          </div>
          <button type="button" className="icon-pill" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>

        <nav className="drawer-nav" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={navLinkClassName} onClick={onClose} end={item.to === '/'}>
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="drawer-section">
          <button type="button" className="drawer-action" onClick={onThemeToggle}>
            {theme === 'light' ? <SunMedium size={18} /> : <MoonStar size={18} />}
            <span>Theme: {theme === 'light' ? 'Light' : 'Dark'}</span>
          </button>
        </div>

        <div className="drawer-section">
          {user ? (
            <button type="button" className="drawer-action danger" onClick={onLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          ) : (
            <div className="drawer-auth">
              <div className="drawer-eyebrow">Sign in</div>
              <GoogleLoginButton
                onSuccess={onGoogleLogin}
                onError={onGoogleError}
              />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
