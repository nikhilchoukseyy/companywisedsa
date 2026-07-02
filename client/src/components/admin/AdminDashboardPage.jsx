import { useEffect, useState } from 'react';
import { FiShield } from 'react-icons/fi';
import { adminApi } from '../../utils/api';
import AdminSectionPage from './AdminSectionPage';

export default function AdminDashboardPage() {
  const [status, setStatus] = useState('Checking admin access...');

  useEffect(() => {
    let active = true;

    adminApi
      .dashboard()
      .then((payload) => {
        if (active) {
          setStatus(payload?.message || 'Admin access granted');
        }
      })
      .catch((error) => {
        if (active) {
          setStatus(error.message || 'Admin access check failed');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="grid gap-5">
      <AdminSectionPage
        title="Dashboard"
        description="This is the protected admin landing page. It is ready for future operational widgets, moderation tools, and support workflows."
      />

      <div className="rounded-[24px] border border-border bg-surface p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          <FiShield size={14} />
          <span>Protected endpoint</span>
        </div>
        <p className="mt-4 text-sm leading-7 text-text-secondary">{status}</p>
      </div>
    </div>
  );
}
