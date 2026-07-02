import { useMemo } from 'react';
import {
  FiArrowLeft,
  FiLogOut,
  FiCheck,
  FiExternalLink,
} from 'react-icons/fi';

const DIFFICULTIES = [
  { key: 'EASY', label: 'Easy', dot: 'bg-easy', text: 'text-easy', bar: 'bg-easy' },
  { key: 'MEDIUM', label: 'Medium', dot: 'bg-medium', text: 'text-medium', bar: 'bg-medium' },
  { key: 'HARD', label: 'Hard', dot: 'bg-hard', text: 'text-hard', bar: 'bg-hard' },
];

/* ---------- helpers ---------- */

function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function timeAgo(dateString) {
  if (!dateString) return '';
  const diffMs = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

function difficultyMeta(key) {
  return DIFFICULTIES.find((d) => d.key === key) || DIFFICULTIES[1];
}

/* ---------- small presentational pieces ---------- */

function StatCard({ label, value, valueClass = 'text-text-primary' }) {
  return (
    <div className="flex flex-col gap-1 rounded-[10px] border border-border bg-surface-raised px-4 py-3.5">
      <span className="text-xs font-medium text-text-secondary">{label}</span>
      <strong className={`text-[22px] font-bold leading-tight ${valueClass}`}>{value}</strong>
    </div>
  );
}

function ProgressBar({ value, barClass = 'bg-brand' }) {
  const pct = Math.min(Math.max(value || 0, 0), 100);
  const visiblePct = pct > 0 && pct < 4 ? 4 : pct;
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 overflow-hidden rounded-full bg-surface-raised"
    >
      <div
        className={`h-full rounded-full transition-[width] duration-500 ${barClass}`}
        style={{ width: `${visiblePct}%` }}
      />
    </div>
  );
}

/* Signature element: a segmented ring showing overall completion,
   arcs sized by how many of each difficulty have been solved. */
function SolvedRing({ totals }) {
  const size = 168;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const total = totals.totalUniqueQuestions || 0;
  const strokeClasses = { EASY: 'stroke-easy', MEDIUM: 'stroke-medium', HARD: 'stroke-hard' };

  const segments = useMemo(() => {
    let offsetAcc = 0;
    return DIFFICULTIES.map((d) => {
      const solved = totals.difficultySolved?.[d.key] || 0;
      const fraction = total > 0 ? solved / total : 0;
      const length = fraction * circumference;
      const visibleLength = solved > 0 ? Math.max(length, 12) : 0;
      const seg = { ...d, length: visibleLength, offset: offsetAcc };
      offsetAcc += visibleLength;
      return seg;
    });
  }, [totals, total, circumference]);

  return (
    <div className="relative mx-auto h-[144px] w-[144px] shrink-0 sm:h-[168px] sm:w-[168px]">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        width="100%"
        height="100%"
        role="img"
        aria-label={`${totals.completionPercentage}% of questions solved`}
        className="h-full w-full"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          className="stroke-surface-raised"
          strokeWidth={stroke}
        />
        {segments.map((seg) =>
          seg.length > 0 ? (
            <circle
              key={seg.key}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              className={`${strokeClasses[seg.key] || 'stroke-border'} transition-[stroke-dasharray] duration-500`}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${seg.length} ${circumference - seg.length}`}
              strokeDashoffset={-seg.offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          ) : null
        )}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <strong className="text-[28px] font-extrabold leading-tight text-brand">{totals.solvedQuestions}</strong>
        <span className="mt-0.5 text-xs text-text-secondary">/ {total} solved</span>
        <em className="mt-1.5 text-[13px] font-bold not-italic text-brand">
          {totals.completionPercentage}%
        </em>
      </div>
    </div>
  );
}

function DifficultyRow({ difficulty, solved, total }) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2 text-[13px]">
        <span className={`h-2 w-2 shrink-0 rounded-full ${difficulty.dot}`} />
        <span className="flex-1 font-semibold">{difficulty.label}</span>
        <span className="font-bold text-text-primary">
          {solved}
          <span className="font-medium text-text-muted">/{total}</span>
        </span>
      </div>
      <ProgressBar value={pct} barClass={difficulty.bar} />
    </div>
  );
}

function CompanyRow({ company }) {
  return (
    <div className="grid grid-cols-1 gap-2 border-b border-border px-4 py-3 last:border-b-0 hover:bg-surface-raised sm:grid-cols-[150px_1fr_44px] sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-col">
        <strong className="truncate text-sm font-semibold">{company.company}</strong>
        <span className="text-[11px] text-text-muted">
          {company.solvedQuestions} / {company.totalQuestions} solved
        </span>
      </div>
      <ProgressBar value={company.completionPercentage} />
      <span className="text-[13px] font-bold text-brand sm:text-right">
        {company.completionPercentage}%
      </span>
    </div>
  );
}

function ActivityRow({ activity }) {
  const meta = difficultyMeta(activity.difficulty);
  return (
    <a
      href={activity.link}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 hover:bg-surface-raised"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-easy/10 text-easy">
        <FiCheck size={13} />
      </span>
      <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium group-hover:text-brand">
        {activity.title}
      </span>
      <span className={`shrink-0 rounded-full bg-current/10 px-2 py-0.5 text-[11px] font-bold ${meta.text}`}>
        {meta.label}
      </span>
      <span className="hidden w-14 shrink-0 text-right text-[11px] text-text-muted sm:block">
        {timeAgo(activity.solvedAt)}
      </span>
      <FiExternalLink className="hidden shrink-0 text-text-muted sm:block" size={12} />
    </a>
  );
}

/* ---------- main component ---------- */

export default function ProfileDashboard({
  dashboard,
  onBack,
  onLogout,
  user,
  backLabel = 'Back to questions',
}) {
  const totals = dashboard?.totals;
  const companyProgress = dashboard?.companyProgress || [];
  const recentActivity = dashboard?.recentActivity || [];
  const topCompanies = useMemo(
    () =>
      [...companyProgress]
        .sort((a, b) => b.completionPercentage - a.completionPercentage)
        .slice(0, 12),
    [companyProgress]
  );

  if (!dashboard || !totals) {
    return (
      <section className="w-full p-3 text-text-primary sm:p-4 md:p-6">
        <div className="mb-6 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center">
          <div className="h-14 w-14 animate-pulse rounded-full bg-surface-raised" />
          <div className="flex flex-col gap-2">
            <div className="h-[18px] w-40 animate-pulse rounded-md bg-surface-raised" />
            <div className="h-3 w-28 animate-pulse rounded-md bg-surface-raised" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[74px] animate-pulse rounded-[10px] bg-surface-raised" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full p-3 font-sans text-text-primary sm:p-4 md:p-6">
      {/* Header */}
      <header className="mb-6 flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-light text-lg font-bold text-page">
            {getInitials(user?.name)}
          </div>
          <div className="min-w-0">
            <span className="mb-0.5 block text-xs font-semibold uppercase tracking-wider text-brand">
              Profile
            </span>
            <h1 className="truncate text-[22px] font-bold leading-tight">{user?.name}</h1>
            <p className="truncate text-[13px] text-text-secondary">{user?.email}</p>
          </div>
        </div>
        <div className="flex w-full shrink-0 flex-col gap-2.5 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={onBack}
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-surface px-4 py-2 text-sm font-semibold hover:border-border-strong hover:bg-surface-raised active:translate-y-px sm:w-auto"
          >
            <FiArrowLeft size={14} />
            {backLabel}
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center justify-center gap-1.5 rounded-md border border-border bg-transparent px-4 py-2 text-sm font-semibold text-text-secondary hover:border-hard hover:text-hard active:translate-y-px sm:w-auto"
          >
            <FiLogOut size={14} />
            Logout
          </button>
        </div>
      </header>

      {/* Ring + stats overview */}
      <div className="mb-6 flex flex-col items-stretch gap-6 rounded-2xl border border-border bg-surface p-4 sm:items-center sm:p-7 lg:flex-row">
        <SolvedRing totals={totals} />

        <div className="flex min-w-0 w-full flex-1 flex-col gap-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Total Questions" value={totals.totalUniqueQuestions} />
            <StatCard label="Solved" value={totals.solvedQuestions} valueClass="text-easy" />
            <StatCard
              label="Bookmarked"
              value={totals.bookmarkedQuestions || 0}
              valueClass="text-brand"
            />
            <StatCard label="Remaining" value={totals.remainingQuestions} />
          </div>

          <div className="flex flex-col gap-3.5">
            {DIFFICULTIES.map((d) => (
              <DifficultyRow
                key={d.key}
                difficulty={d}
                solved={totals.difficultySolved?.[d.key] || 0}
                total={totals.difficultyTotals?.[d.key] || 0}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Company progress */}
      <section className="mb-6">
        <div className="mb-3.5 flex items-baseline justify-between gap-2">
          <h2 className="text-base font-bold">Company Progress</h2>
          <span className="text-xs text-text-muted">{companyProgress.length} companies</span>
        </div>
        {topCompanies.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface px-5 py-7 text-center">
            <p className="mb-1 font-semibold">No company activity yet.</p>
            <span className="text-[13px] text-text-muted">
              Solve questions tagged to a company to see progress here.
            </span>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {topCompanies.map((company) => (
              <CompanyRow key={company.company} company={company} />
            ))}
          </div>
        )}
      </section>

      {/* Recent activity */}
      <section className="mb-6">
        <div className="mb-3.5 flex items-baseline justify-between gap-2">
          <h2 className="text-base font-bold">Recent Activity</h2>
        </div>
        {recentActivity.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-surface px-5 py-7 text-center">
            <p className="mb-1 font-semibold">No solved activity yet.</p>
            <span className="text-[13px] text-text-muted">
              Your recently solved questions will show up here.
            </span>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-border bg-surface">
            {recentActivity.map((activity) => (
              <ActivityRow key={`${activity.questionId}-${activity.solvedAt}`} activity={activity} />
            ))}
          </div>
        )}
      </section>

      
      
    </section>
  );
}

