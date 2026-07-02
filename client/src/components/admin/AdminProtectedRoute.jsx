import { Navigate, Outlet } from 'react-router-dom';

export default function AdminProtectedRoute({ loadingUser, user }) {

  if (loadingUser) {
    return (
      <section className="mx-auto w-full max-w-[1280px] px-3 py-6 sm:px-6 lg:px-8">
        <div className="rounded-[24px] border border-border bg-surface p-6 text-sm text-text-secondary">
          Loading admin access...
        </div>
      </section>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
