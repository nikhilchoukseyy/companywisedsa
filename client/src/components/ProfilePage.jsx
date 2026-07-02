import { useNavigate, useOutletContext } from 'react-router-dom';
import GoogleLoginButton from './GoogleLoginButton';
import ProfileDashboard from './ProfileDashboard';

export default function ProfilePage() {
  const { dashboard, user, onGoogleLogin, onLogout } = useOutletContext();
  const navigate = useNavigate();

  return (
    <section className="mx-auto w-full max-w-[1280px] px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
      {user ? (
        <ProfileDashboard
          dashboard={dashboard}
          onBack={() => navigate('/companies')}
          onLogout={onLogout}
          user={user}
          backLabel="Browse companies"
        />
      ) : (
        <div className="rounded-[24px] border border-border bg-surface p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Profile</div>
          <h1 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight text-text-primary">
            Sign in to sync your progress
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
            Your profile and solved questions will be restored across devices after Google sign-in.
          </p>
          <div className="mt-5">
            <GoogleLoginButton onSuccess={onGoogleLogin} onError={() => {}} />
          </div>
        </div>
      )}
    </section>
  );
}
