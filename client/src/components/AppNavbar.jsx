import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, Menu, MoonStar, SunMedium, UserCircle2 } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Companies', to: '/companies' },
  { label: 'Bookmarks', to: '/bookmarks' },
  { label: 'Settings', to: '/settings' },
];

function navLinkClassName({ isActive }) {
  return `nav-link ${isActive ? 'is-active' : ''}`;
}

export default function AppNavbar({
  theme,
  onThemeToggle,
  onMenuClick,
  onGoogleLogin,
  onGoogleError,
  onLogout,
  user,
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    function handlePointerDown(event) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return (
    <header className="app-navbar">
      <Link to="/" className="brand-link" aria-label="DSA Prep home">
        <span className="brand-mark" aria-hidden="true">
          DP
        </span>
        <span className="brand-copy">
          <strong>Company-Wise DSA</strong>
          <span>Prep Platform</span>
        </span>
      </Link>

      <nav className="nav-center" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={navLinkClassName} end={item.to === '/'}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="nav-actions">
        <button type="button" className="icon-pill theme-toggle" onClick={onThemeToggle}>
          {theme === 'light' ? <SunMedium size={18} /> : <MoonStar size={18} />}
          <span className="desktop-only">{theme === 'light' ? 'Light' : 'Dark'}</span>
        </button>

        {user ? (
          <div className="profile-menu" ref={profileMenuRef}>
            <button
              type="button"
              className="profile-menu-button"
              onClick={() => setProfileMenuOpen((open) => !open)}
              aria-haspopup="menu"
              aria-expanded={profileMenuOpen}
            >
              <span className="profile-avatar" aria-hidden="true">
                {String(user.name || 'U')
                  .slice(0, 1)
                  .toUpperCase()}
              </span>
              <span className="desktop-only profile-meta">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
              </span>
              <ChevronDown size={16} />
            </button>

            {profileMenuOpen && (
              <div className="profile-dropdown" role="menu">
                <Link to="/profile" className="profile-dropdown-item" onClick={() => setProfileMenuOpen(false)}>
                  <UserCircle2 size={16} />
                  Profile
                </Link>
                <Link to="/settings" className="profile-dropdown-item" onClick={() => setProfileMenuOpen(false)}>
                  <span className="profile-dot" />
                  Settings
                </Link>
                <button
                  type="button"
                  className="profile-dropdown-item profile-dropdown-button"
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onLogout?.();
                  }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="nav-google-wrap">
            <GoogleLoginButton onSuccess={onGoogleLogin} onError={onGoogleError} />
          </div>
        )}

        <button
          type="button"
          className="icon-pill mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>
      </div>
    </header>
  );
}
