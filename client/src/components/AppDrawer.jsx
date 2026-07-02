import { useEffect } from 'react';
import {
  FiBookmark,
  FiBriefcase,
  FiHome,
  FiLogOut,
  FiUser,
  FiX,
} from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';

const navItems = [
  { label: 'Home', to: '/', icon: FiHome },
  { label: 'Companies', to: '/companies', icon: FiBriefcase },
  { label: 'Profile', to: '/profile', icon: FiUser },
  { label: 'Bookmarks', to: '/bookmarks', icon: FiBookmark },
];

function navLinkClassName({ isActive }) {
  return [
    'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors',
    isActive
      ? 'border-brand bg-brand text-page shadow-[0_10px_20px_rgba(255,161,22,0.18)]'
      : 'border-border bg-surface text-text-primary hover:border-border-strong hover:bg-surface-raised',
  ].join(' ');
}

export default function AppDrawer({
  open,
  onClose,
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
        className={`fixed inset-0 z-40 bg-page/70 transition-opacity md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
        aria-label="Close menu overlay"
      />

      <aside
        className={`fixed right-0 top-0 z-50 grid h-dvh w-[min(88vw,360px)] grid-rows-[auto_1fr_auto_auto] gap-4 border-l border-border bg-surface p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition-transform duration-200 md:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
              Navigation
            </div>
            <strong className="text-base text-text-primary">DSA Prep</strong>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-primary transition-colors hover:border-border-strong hover:bg-surface-raised"
            onClick={onClose}
            aria-label="Close menu"
          >
            <FiX size={18} />
          </button>
        </div>

        <nav className="grid content-start gap-2" aria-label="Mobile navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink key={item.to} to={item.to} className={navLinkClassName} onClick={onClose} end={item.to === '/'}>
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="grid gap-3">
          {user ? (
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface-raised"
              onClick={onLogout}
            >
              <FiLogOut size={16} />
              <span>Logout</span>
            </button>
          ) : (
            <div className="grid gap-3">
              <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-secondary">
                Sign in
              </div>
              <GoogleLoginButton onSuccess={onGoogleLogin} onError={onGoogleError} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}


