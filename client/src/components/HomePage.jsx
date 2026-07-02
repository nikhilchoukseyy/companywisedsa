import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import { FiShield } from 'react-icons/fi';
import ReviewMarquee from './ReviewMarquee';
import FeedbackForm from './FeedbackForm';
import GoogleLoginButton from './GoogleLoginButton';

export default function HomePage() {
  const {
    dashboard,
    preferences,
    companyMap,
    companies,
    user,
    onGoogleLogin,
  } = useOutletContext();

  const navigate = useNavigate();

  const openCompany = (company) =>
    navigate(`/company/${encodeURIComponent(company)}`);

  const lastCompany =
    preferences.lastCompany && companyMap[preferences.lastCompany]
      ? preferences.lastCompany
      : '';

  const solved = dashboard?.totals?.solvedQuestions || 0;
  const total = dashboard?.totals?.totalUniqueQuestions || 0;
  const completion = dashboard?.totals?.completionPercentage || 0;

  const topCompanies = companies.slice(0, 6);

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-4 py-6 lg:px-8">
      {/* HERO */}
      <div className="grid gap-6 rounded-[28px] border border-border bg-surface p-6 shadow-[0_24px_60px_rgba(0,0,0,0.35)] lg:grid-cols-[1.6fr_0.9fr]">
        {/* LEFT */}
        <div className="flex flex-col justify-between gap-8">
          <div>
            <div className="inline-flex rounded-full border border-brand/40 bg-brand/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-brand">
              Company-wise DSA Prep
            </div>

            <h1 className="mt-6 max-w-[12ch] text-[clamp(2.2rem,4vw,4rem)] font-black leading-[0.95] tracking-tight text-text-primary">
              Explore interview questions by company, without losing your
              progress.
            </h1>

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-text-secondary">
              Jump into company-wise interview questions, mark solved problems,
              and continue your preparation seamlessly across devices with Google
              sync.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              to="/companies"
              className="inline-flex items-center justify-center rounded-full bg-brand px-7 py-3 text-sm font-bold text-page transition hover:bg-brand-light"
            >
              Browse Companies
            </Link>

            {lastCompany && (
              <button
                type="button"
                onClick={() => openCompany(lastCompany)}
                className="inline-flex items-center justify-center rounded-full border border-brand/40 bg-brand/10 px-7 py-3 text-sm font-semibold text-brand transition hover:bg-brand/20"
              >
                Continue {lastCompany}
              </button>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="grid gap-5 lg:grid-rows-2">
          {/* Solves */}
          <div className="flex min-h-[190px] flex-col justify-between rounded-2xl border border-border bg-surface-raised p-6">
            <div>
              <span className="text-sm font-medium text-text-secondary">
                Questions Solved
              </span>

              <h2 className="mt-3 text-[2.7rem] font-black leading-none text-brand">
                {solved}/{total}
              </h2>
            </div>

            <div className="text-sm font-medium text-brand">
              {completion}% completion
            </div>
          </div>

          {/* Sync */}
          <div className="flex min-h-[190px] flex-col justify-between rounded-2xl border border-border bg-surface-raised p-6">
            <div>
              <span className="text-sm font-medium text-text-secondary">
                Saved Progress
              </span>

              <h2 className="mt-3 text-[2.7rem] font-black leading-none text-brand">
                {user ? 'On' : 'Off'}
              </h2>
            </div>

            <div className="text-sm text-text-secondary">
              {user
                ? 'Synced with your Google account'
                : 'Sign in with Google'}
            </div>
          </div>
        </div>
      </div>

      {/* POPULAR COMPANIES */}
      <div className="rounded-[24px] border border-border bg-surface p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-bold text-text-primary">
            Popular Companies
          </h2>

          <Link
            to="/companies"
            className="text-sm font-semibold text-brand hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          {topCompanies.map((company) => (
            <button
              key={company}
              type="button"
              onClick={() => openCompany(company)}
              className="inline-flex min-w-[170px] items-center justify-center rounded-full border border-border bg-surface-raised px-5 py-3 text-sm font-semibold text-text-primary transition hover:border-brand hover:bg-brand/10 hover:text-brand"
            >
              {company}
            </button>
          ))}
        </div>
      </div>

      {/* REVIEWS */}
      <div className="rounded-[24px] border border-border bg-surface p-6">
        <ReviewMarquee />
      </div>

      {/* FEEDBACK */}
      <div className="rounded-[24px] border border-border bg-surface p-6">
        <FeedbackForm />
      </div>

      {/* SYNC */}
      <div className="rounded-[24px] border border-border bg-surface p-6">
        <h2 className="text-xl font-bold text-text-primary">
          Sync your progress
        </h2>

        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-text-secondary">
          Sign in with Google to automatically save solved questions and restore
          your progress whenever you return.
        </p>

        <div className="mt-6">
          {user ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm font-semibold text-green-400">
              <FiShield size={18} />
              <span>Your progress is securely synced.</span>
            </div>
          ) : (
            <GoogleLoginButton
              onSuccess={onGoogleLogin}
              onError={() => {}}
            />
          )}
        </div>
      </div>
    </section>
  );
}