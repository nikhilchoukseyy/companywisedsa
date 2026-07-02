const DIFF_LABELS = ['EASY', 'MEDIUM', 'HARD'];

function StatCard({ label, value, detail }) {
  return (
    <div className="stat-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="progress-track" aria-label={`${value}% complete`}>
      <div className="progress-fill" style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }} />
    </div>
  );
}

export default function ProfileDashboard({ dashboard, onBack, onLogout, user }) {
  const totals = dashboard?.totals;
  const companyProgress = dashboard?.companyProgress || [];
  const recentActivity = dashboard?.recentActivity || [];
  const topCompanies = [...companyProgress]
    .sort((a, b) => b.completionPercentage - a.completionPercentage)
    .slice(0, 12);

  if (!dashboard || !totals) {
    return (
      <section className="profile-view">
        <div className="status-panel">Loading dashboard...</div>
      </section>
    );
  }

  return (
    <section className="profile-view">
      <header className="profile-header">
        <div>
          <div className="company-list-eyebrow">Profile</div>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
        </div>
        <div className="profile-actions">
          <button type="button" className="secondary-button" onClick={onBack}>
            Back to questions
          </button>
          <button type="button" className="secondary-button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-grid">
        <StatCard label="Total Questions" value={totals.totalUniqueQuestions} />
        <StatCard label="Solved" value={totals.solvedQuestions} />
        <StatCard label="Remaining" value={totals.remainingQuestions} />
        <StatCard label="Completion" value={`${totals.completionPercentage}%`} />
      </div>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Difficulty Progress</h2>
        </div>
        <div className="dashboard-grid compact">
          {DIFF_LABELS.map((difficulty) => {
            const solved = totals.difficultySolved?.[difficulty] || 0;
            const total = totals.difficultyTotals?.[difficulty] || 0;
            return (
              <StatCard
                key={difficulty}
                label={difficulty}
                value={solved}
                detail={`${solved} / ${total} solved`}
              />
            );
          })}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Company Progress</h2>
        </div>
        <div className="company-progress-list">
          {topCompanies.map((company) => (
            <div className="company-progress-row" key={company.company}>
              <div>
                <strong>{company.company}</strong>
                <span>
                  {company.solvedQuestions} / {company.totalQuestions} solved
                </span>
              </div>
              <ProgressBar value={company.completionPercentage} />
              <b>{company.completionPercentage}%</b>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Recent Activity</h2>
        </div>
        {recentActivity.length === 0 ? (
          <div className="empty-panel">No solved activity yet.</div>
        ) : (
          <div className="activity-list">
            {recentActivity.map((activity) => (
              <a
                key={`${activity.questionId}-${activity.solvedAt}`}
                href={activity.link}
                target="_blank"
                rel="noreferrer"
                className="activity-row"
              >
                <span>{activity.title}</span>
                <small>{activity.difficulty}</small>
              </a>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <h2>Preferences</h2>
        </div>
        <div className="preferences-list">
          <span>Last company: {user?.preferences?.lastCompany || 'Not set'}</span>
          <span>Last file: {user?.preferences?.lastFile || 'Not set'}</span>
          <span>Difficulty: {user?.preferences?.difficultyFilter || 'ALL'}</span>
          <span>Language: {user?.preferences?.preferredLanguage || 'python'}</span>
        </div>
      </section>
    </section>
  );
}
