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
    'inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all whitespace-nowrap',
    isActive
      ? 'bg-brand text-page shadow-lg'
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

  const navLinks =
    user?.role === 'admin'
      ? [...navItems, { label: 'Admin', to: '/admin' }]
      : navItems;

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target)
      ) {
        setProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-page/95 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* MOBILE */}
        <div className="flex h-16 items-center justify-between lg:hidden">

          {/* Left */}
          <Link
            to="/"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-surface shadow-lg transition hover:border-brand/40"
          >
            <img
              src="/favicon.svg"
              alt="CompanyWiseDSA"
              className="h-9 w-9"
            />
          </Link>

          {/* Right */}
          <div className="flex items-center gap-2">

            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() =>
                    setProfileMenuOpen(!profileMenuOpen)
                  }
                  className="flex h-12 items-center gap-2 rounded-full border border-border bg-surface px-3 transition hover:bg-surface-raised"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-raised text-sm font-bold text-brand">
                    {String(user.name || 'U')
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <FiChevronDown size={16} />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-border bg-surface p-2 shadow-2xl">

                    <div className="mb-2 border-b border-border px-3 py-2">
                      <p className="truncate text-sm font-semibold">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-text-secondary">
                        {user.email}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() =>
                        setProfileMenuOpen(false)
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm hover:bg-surface-raised"
                    >
                      <FiUser />
                      Profile
                    </Link>

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onLogout?.();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm hover:bg-surface-raised"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <GoogleLoginButton
                onSuccess={onGoogleLogin}
                onError={onGoogleError}
              />
            )}

            <button
              onClick={onMenuClick}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-surface transition hover:bg-surface-raised"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden h-20 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">

          {/* Left */}
          <div className="justify-self-start">
            <Link
              to="/"
              className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface shadow-lg transition hover:border-brand/40"
            >
              <img
                src="/favicon.svg"
                alt="CompanyWiseDSA"
                className="h-10 w-10"
              />
            </Link>
          </div>

          {/* Center */}
          <nav className="flex items-center gap-2 rounded-full border border-border bg-surface p-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={navLinkClassName}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Right */}
          <div className="flex justify-self-end">

            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() =>
                    setProfileMenuOpen(!profileMenuOpen)
                  }
                  className="flex h-12 items-center gap-3 rounded-full border border-border bg-surface px-3 transition hover:bg-surface-raised"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-raised font-semibold text-brand">
                    {String(user.name || 'U')
                      .charAt(0)
                      .toUpperCase()}
                  </span>

                  <div className="max-w-[170px] text-left">
                    <p className="truncate text-sm font-semibold">
                      {user.name}
                    </p>

                    <p className="truncate text-xs text-text-secondary">
                      {user.email}
                    </p>
                  </div>

                  <FiChevronDown />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-border bg-surface p-2 shadow-2xl">

                    <Link
                      to="/profile"
                      onClick={() =>
                        setProfileMenuOpen(false)
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-surface-raised"
                    >
                      <FiUser />
                      Profile
                    </Link>

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onLogout?.();
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left hover:bg-surface-raised"
                    >
                      <FiLogOut />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <GoogleLoginButton
                onSuccess={onGoogleLogin}
                onError={onGoogleError}
              />
            )}
          </div>
        </div>

      </div>
    </header>
  );
}