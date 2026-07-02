import { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { FiExternalLink, FiFlag, FiRefreshCw, FiShield } from 'react-icons/fi';
import { adminApi } from '../../utils/api';
import {
  getAnalyticsSnapshot,
  subscribeAnalyticsSnapshot,
  trackCompilerOpened,
  trackCompilerRun,
  trackAdminAction,
} from '../../utils/analytics';
import { buildPosthogUrl, POSTHOG_PROJECT_URL } from '../../config/posthog';

const ACTIONS = [
  { label: 'Open Dashboard', path: '', description: 'Overview of the project home.' },
  { label: 'Open Live Events', path: 'events', description: 'Inspect incoming activity in real time.' },
  { label: 'Open Session Replay', path: 'replay', description: 'Review captured sessions and errors.' },
  { label: 'Open Heatmaps', path: 'heatmaps', description: 'See click density and engagement patterns.' },
  { label: 'Open Funnels', path: 'funnels', description: 'Measure drop-off through key flows.' },
  { label: 'Open Insights', path: 'insights', description: 'Explore event trends and breakdowns.' },
  { label: 'Open Feature Flags', path: 'feature-flags', description: 'Review active flags and rollout state.' },
  { label: 'Open Experiments', path: 'experiments', description: 'Track experiments and variants.' },
];

function StatCard({ label, value, hint }) {
  return (
    <div className="rounded-[20px] border border-border bg-surface-raised p-4">
      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{label}</div>
      <div className="mt-2 text-2xl font-black tracking-tight text-text-primary">{value}</div>
      {hint ? <div className="mt-2 text-xs leading-6 text-text-secondary">{hint}</div> : null}
    </div>
  );
}

function buildStatusText(value) {
  if (value === null || value === undefined || value === '') {
    return 'Not available';
  }

  if (typeof value === 'string') {
    return value;
  }

  return String(value);
}

export default function AdminAnalyticsPage({ user }) {
  const [endpointStatus, setEndpointStatus] = useState({
    loading: true,
    message: 'Checking admin endpoint...',
    stats: null,
  });
  const analyticsSnapshot = useSyncExternalStore(
    subscribeAnalyticsSnapshot,
    getAnalyticsSnapshot,
    getAnalyticsSnapshot
  );

  useEffect(() => {
    let active = true;

    adminApi
      .dashboard()
      .then((payload) => {
        if (active) {
          setEndpointStatus({
            loading: false,
            message: payload?.message || 'Admin access granted',
            stats: payload?.stats || null,
          });
        }
      })
      .catch((error) => {
        if (active) {
          setEndpointStatus({
            loading: false,
            message: error.message || 'Admin access check failed',
            stats: null,
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const stats = endpointStatus.stats || {};
  const featureFlags = analyticsSnapshot.featureFlags || [];
  const projectUrlLabel = POSTHOG_PROJECT_URL || 'Not configured';

  const quickLinks = useMemo(
    () =>
      ACTIONS.map((action) => ({
        ...action,
        href: buildPosthogUrl(action.path),
      })),
    []
  );

  const handleActionClick = (label) => {
    trackAdminAction(label, {
      page: 'analytics',
    });
  };

  const handleCompilerOpen = () => {
    trackCompilerOpened('python', {
      page: 'analytics',
      source: 'admin_placeholder',
    });
  };

  const handleCompilerRun = () => {
    trackCompilerRun('python', {
      page: 'analytics',
      source: 'admin_placeholder',
      status: 'placeholder',
    });
  };

  return (
    <section className="grid gap-5">
      <div className="rounded-[24px] border border-border bg-surface p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)] sm:p-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
          <FiShield size={14} />
          <span>Analytics Overview</span>
        </div>
        <h1 className="mt-4 text-[clamp(1.9rem,4vw,2.8rem)] font-black tracking-tight text-text-primary">
          PostHog connected state
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-text-secondary">
          This page keeps a lightweight operational snapshot of the analytics setup and provides
          direct shortcuts into the PostHog workspace.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Analytics" value={analyticsSnapshot.configured ? 'Connected' : 'Not configured'} />
        <StatCard label="Tracked Events" value={analyticsSnapshot.eventCount} hint={buildStatusText(analyticsSnapshot.lastEvent)} />
        <StatCard label="Current Admin" value={user?.name || 'Unknown'} hint={user?.email || 'No admin profile loaded'} />
        <StatCard
          label="Project URL"
          value={POSTHOG_PROJECT_URL ? 'Available' : 'Missing'}
          hint={projectUrlLabel}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-[24px] border border-border bg-surface p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)] sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Platform Stats</div>
              <h2 className="mt-2 text-xl font-bold text-text-primary">Backend snapshot</h2>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface"
              onClick={() => window.location.reload()}
            >
              <FiRefreshCw size={14} />
              Refresh
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <StatCard label="Endpoint" value={endpointStatus.loading ? 'Loading' : 'Ready'} hint={endpointStatus.message} />
            <StatCard label="Users" value={buildStatusText(stats.users)} />
            <StatCard label="Admins" value={buildStatusText(stats.admins)} />
            <StatCard label="Companies" value={buildStatusText(stats.companies)} />
            <StatCard label="Questions" value={buildStatusText(stats.questions)} />
            <StatCard label="Solved Questions" value={buildStatusText(stats.solvedQuestions)} />
            <StatCard label="Bookmarks" value={buildStatusText(stats.bookmarks)} />
            <StatCard label="Reviews" value={buildStatusText(stats.reviews)} />
            <StatCard label="Feedback" value={buildStatusText(stats.feedback)} />
            <StatCard label="Compiler Runs" value={buildStatusText(stats.compilerRuns)} />
          </div>
        </div>

        <div className="rounded-[24px] border border-border bg-surface p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)] sm:p-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Feature Flags</div>
          <h2 className="mt-2 text-xl font-bold text-text-primary">Current flags</h2>
          <p className="mt-2 text-sm leading-7 text-text-secondary">
            Feature flag state is read from the live PostHog client. This keeps the panel useful
            even before any dedicated admin tooling ships.
          </p>

          <div className="mt-5 grid gap-3">
            {featureFlags.length > 0 ? (
              featureFlags.map((flag) => (
                <div
                  key={flag.key}
                  className="flex items-start justify-between gap-3 rounded-[18px] border border-border bg-surface-raised px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-text-primary">{flag.key}</div>
                    <div className="mt-1 text-xs text-text-secondary">{String(flag.value)}</div>
                  </div>
                  <FiFlag className="shrink-0 text-brand" size={16} />
                </div>
              ))
            ) : (
              <div className="rounded-[18px] border border-dashed border-border bg-surface-raised px-4 py-6 text-sm text-text-secondary">
                No feature flags have been loaded yet.
              </div>
            )}
          </div>

          <div className="mt-6 rounded-[20px] border border-border bg-surface-raised p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Latest Event</div>
            <div className="mt-2 text-sm font-semibold text-text-primary">
              {analyticsSnapshot.lastEvent || 'None yet'}
            </div>
            <div className="mt-1 text-xs text-text-secondary">
              {analyticsSnapshot.lastEventAt || 'Waiting for app activity'}
            </div>
          </div>

          <div className="mt-4 rounded-[20px] border border-border bg-surface-raised p-4">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Compiler Hooks</div>
            <p className="mt-2 text-xs leading-6 text-text-secondary">
              These buttons keep the compiler analytics helpers connected until a dedicated compiler
              surface ships.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface"
                onClick={handleCompilerOpen}
              >
                Record Open
              </button>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-brand px-3.5 py-2 text-xs font-bold text-page transition-colors hover:bg-brand-light"
                onClick={handleCompilerRun}
              >
                Record Run
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[24px] border border-border bg-surface p-5 shadow-[0_24px_60px_rgba(0,0,0,0.24)] sm:p-6">
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">PostHog Shortcuts</div>
        <h2 className="mt-2 text-xl font-bold text-text-primary">Open the workspace</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {quickLinks.map((action) => {
            const disabled = !action.href;

            return (
              <a
                key={action.label}
                href={action.href || undefined}
                target="_blank"
                rel="noreferrer"
                aria-disabled={disabled}
                className={`flex h-full flex-col justify-between rounded-[20px] border px-4 py-4 transition-colors ${
                  disabled
                    ? 'pointer-events-none border-border bg-surface-raised text-text-muted'
                    : 'border-border bg-surface-raised text-text-primary hover:border-brand hover:bg-brand/10'
                }`}
                onClick={() => handleActionClick(action.label)}
              >
                <div>
                  <div className="text-sm font-semibold">{action.label}</div>
                  <div className="mt-2 text-xs leading-6 text-text-secondary">{action.description}</div>
                </div>
                <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand">
                  <span>{disabled ? 'Set POSTHOG_PROJECT_URL' : 'Open'}</span>
                  <FiExternalLink size={14} />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
