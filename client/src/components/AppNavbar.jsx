import { useEffect, useRef, useState } from 'react';
import {
  FiChevronDown,
  FiLogOut,
  FiMenu,
  FiUser,
} from 'react-icons/fi';
import { Link, NavLink } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Companies', to: '/companies' },
  { label: 'Bookmarks', to: '/bookmarks' },
];

function navLinkClassName({ isActive }) {
  return [
    'inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors',
    isActive
      ? 'border border-brand bg-brand text-page shadow-[0_10px_20px_rgba(255,161,22,0.22)]'
      : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary',
  ].join(' ');
}

export default function AppNavbar({
  onMenuClick,
  onGoogleLogin,
  onGoogleError,
  onLogout,
  user,
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const navLinks = user?.role === 'admin' ? [...navItems, { label: 'Admin', to: '/admin' }] : navItems;

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
    <header className="sticky top-0 z-40 border-b border-border bg-page/95 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-[1280px] items-center gap-2 px-3 py-3 sm:gap-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand text-sm font-black text-page shadow-[0_12px_28px_rgba(255,161,22,0.3)] sm:h-10 sm:w-10">
            DP
          </span>
          <span className="hidden min-w-0 flex-col sm:flex">
            <strong className="truncate text-sm font-bold text-text-primary">Company-Wise DSA</strong>
            <span className="truncate text-xs text-text-secondary">Prep Platform</span>
          </span>
        </Link>

        <nav className="mx-auto hidden items-center gap-2 rounded-full border border-border bg-surface p-1 md:flex">
          {navLinks.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClassName} end={item.to === '/'}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border bg-surface px-2.5 py-1.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface-raised"
                onClick={() => setProfileMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={profileMenuOpen}
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-surface-raised text-brand">
                  {String(user.name || 'U').slice(0, 1).toUpperCase()}
                </span>
                <span className="hidden max-w-[140px] flex-col text-left sm:flex">
                  <strong className="truncate text-xs">{user.name}</strong>
                  <span className="truncate text-[11px] text-text-secondary">{user.email}</span>
                </span>
                <FiChevronDown size={15} />
              </button>

              {profileMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+10px)] min-w-56 rounded-2xl border border-border bg-surface p-2 shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
                >
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface-raised"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <FiUser size={16} />
                    Profile
                  </Link>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-text-primary transition-colors hover:bg-surface-raised"
                    onClick={() => {
                      setProfileMenuOpen(false);
                      onLogout?.();
                    }}
                  >
                    <FiLogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:block">
              <GoogleLoginButton onSuccess={onGoogleLogin} onError={onGoogleError} />
            </div>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-primary transition-colors hover:border-border-strong hover:bg-surface-raised md:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <FiMenu size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}


