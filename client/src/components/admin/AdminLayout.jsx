import { useEffect, useState } from 'react';
import {
  FiBarChart2,
  FiBookmark,
  FiBriefcase,
  FiSettings,
  FiUsers,
  FiMessageSquare,
  FiHelpCircle,
  FiLayout,
  FiLogOut,
  FiMenu,
  FiX,
} from 'react-icons/fi';
import { NavLink, Outlet } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/admin', icon: FiLayout, end: true },
  { label: 'Users', to: '/admin/users', icon: FiUsers },
  { label: 'Companies', to: '/admin/companies', icon: FiBriefcase },
  { label: 'Questions', to: '/admin/questions', icon: FiHelpCircle },
  { label: 'Reviews', to: '/admin/reviews', icon: FiMessageSquare },
  { label: 'Feedback', to: '/admin/feedback', icon: FiBookmark },
  { label: 'Analytics', to: '/admin/analytics', icon: FiBarChart2 },
  { label: 'Settings', to: '/admin/settings', icon: FiSettings },
];

function navLinkClassName({ isActive }) {
  return [
    'flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold transition-colors',
    isActive
      ? 'border-brand bg-brand text-page shadow-[0_10px_20px_rgba(255,161,22,0.18)]'
      : 'border-border bg-surface text-text-primary hover:border-border-strong hover:bg-surface-raised',
  ].join(' ');
}

export default function AdminLayout({ onLogout, user }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, []);

  return (
    <section className="mx-auto flex w-full max-w-[1440px] gap-5 px-3 py-4 sm:px-6 lg:px-8">
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[min(88vw,320px)] border-r border-border bg-surface p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition-transform duration-200 lg:sticky lg:top-24 lg:z-auto lg:h-[calc(100vh-7rem)] lg:w-[280px] lg:translate-x-0 lg:rounded-[28px] lg:p-5 ${
          menuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-start justify-between gap-3 lg:hidden">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Admin Panel</div>
            <strong className="mt-1 block text-lg text-text-primary">Navigation</strong>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-primary"
            onClick={() => setMenuOpen(false)}
            aria-label="Close admin menu"
          >
            <FiX size={18} />
          </button>
        </div>

        <div className="hidden lg:block">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Admin Panel</div>
          <h2 className="mt-2 text-2xl font-black tracking-tight text-text-primary">Control Center</h2>
        </div>

        <nav className="mt-6 grid gap-2" aria-label="Admin navigation">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={navLinkClassName}
                onClick={() => setMenuOpen(false)}
              >
                <Icon size={16} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-5 flex items-center justify-between gap-3 rounded-[24px] border border-border bg-surface px-4 py-4 shadow-[0_24px_60px_rgba(0,0,0,0.2)] sm:px-5">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-primary lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="Open admin menu"
          >
            <FiMenu size={18} />
          </button>

          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Admin Profile</div>
            <div className="mt-2 flex items-center gap-3">
              <div className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-full border border-border bg-surface-raised text-sm font-bold text-brand">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt=""
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <span>{String(user?.name || 'A').slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-text-primary">
                  {user?.name || 'Admin User'}
                </div>
                <div className="truncate text-xs text-text-secondary">{user?.email}</div>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface-raised"
            onClick={onLogout}
          >
            <FiLogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        <div className="lg:pl-0">
          <Outlet />
        </div>
      </div>

      <button
        type="button"
        className={`fixed inset-0 z-40 bg-page/70 transition-opacity lg:hidden ${
          menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setMenuOpen(false)}
        aria-label="Close admin menu overlay"
      />
    </section>
  );
}
