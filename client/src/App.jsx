import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Link,
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { Bookmark, ArrowRight, ShieldAlert } from 'lucide-react';
import { buildCompanyMap, loadCSV } from './utils/csvLoader';
import { defaultPreferences, readCookiePreferences, writeCookiePreferences } from './utils/preferences';
import { questionApi, userApi } from './utils/api';
import { useAuth } from './hooks/useAuth';
import CodeEditor from './components/CodeEditor';
import ProfileDashboard from './components/ProfileDashboard';
import QuestionTable from './components/QuestionTable';
import GoogleLoginButton from './components/GoogleLoginButton';
import AppNavbar from './components/AppNavbar';
import AppDrawer from './components/AppDrawer';

function decodeCompanyParam(value) {
  try {
    return decodeURIComponent(value || '');
  } catch {
    return value || '';
  }
}

function ShellLayout({
  drawerOpen,
  setDrawerOpen,
  theme,
  onThemeToggle,
  onGoogleLogin,
  onGoogleError,
  onLogout,
  user,
  outletContext,
}) {
  const location = useLocation();

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname, setDrawerOpen]);

  return (
    <div className="app-shell">
      <AppNavbar
        theme={theme}
        onThemeToggle={onThemeToggle}
        onMenuClick={() => setDrawerOpen(true)}
        onGoogleLogin={onGoogleLogin}
        onGoogleError={onGoogleError}
        onLogout={onLogout}
        user={user}
      />

      <AppDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        theme={theme}
        onThemeToggle={onThemeToggle}
        onGoogleLogin={onGoogleLogin}
        onGoogleError={onGoogleError}
        onLogout={onLogout}
        user={user}
      />

      <main className="app-content">
        <Outlet context={outletContext} />
      </main>
    </div>
  );
}

function HomePage() {
  const { dashboard, preferences, companyMap, companies, user, onGoogleLogin } = useOutletContext();
  const navigate = useNavigate();
  const openCompany = (company) => navigate(`/company/${encodeURIComponent(company)}`);
  const lastCompany = preferences.lastCompany && companyMap[preferences.lastCompany] ? preferences.lastCompany : '';
  const solved = dashboard?.totals?.solvedQuestions || 0;
  const total = dashboard?.totals?.totalUniqueQuestions || 0;
  const completion = dashboard?.totals?.completionPercentage || 0;
  const topCompanies = companies.slice(0, 6);

  return (
    <section className="page-shell home-shell">
      <div className="hero-card">
        <div className="hero-copy">
          <div className="eyebrow">Company-wise DSA prep</div>
          <h1>Explore interview questions by company, without losing your progress.</h1>
          <p>
            Jump into a company, track solved questions, and keep your progress synced across
            devices.
          </p>

          <div className="hero-actions">
            <Link to="/companies" className="primary-button">
              Browse companies
            </Link>
            {lastCompany && (
              <button
                type="button"
                className="secondary-button"
                onClick={() => openCompany(lastCompany)}
              >
                Continue {lastCompany}
              </button>
            )}
          </div>
        </div>

        <div className="hero-stats">
          <div className="stat-card">
            <span>Solves</span>
            <strong>
              {solved}/{total}
            </strong>
            <small>{completion}% completion</small>
          </div>
          <div className="stat-card">
            <span>Saved progress</span>
            <strong>{user ? 'On' : 'Off'}</strong>
            <small>{user ? 'Synced with your Google account' : 'Sign in with Google'}</small>
          </div>
        </div>
      </div>

      <div className="page-grid">
        <div className="surface-card">
          <div className="section-heading">
            <h2>Popular companies</h2>
            <Link to="/companies" className="inline-link">
              View all
            </Link>
          </div>
          <div className="company-chip-grid">
            {topCompanies.map((company) => (
              <button
                key={company}
                type="button"
                className="company-chip"
                onClick={() => openCompany(company)}
              >
                {company}
              </button>
            ))}
          </div>
        </div>

        <div className="surface-card">
          <div className="section-heading">
            <h2>Sync progress</h2>
          </div>
          <p className="muted-copy">
            Use Google sign-up to save solved questions and restore your progress after refresh.
          </p>
          {user ? (
            <div className="mini-status">
              <ShieldAlert size={18} />
              <span>Your solved questions are synced.</span>
            </div>
          ) : (
            <GoogleLoginButton onSuccess={onGoogleLogin} onError={() => {}} />
          )}
        </div>
      </div>
    </section>
  );
}

function CompaniesPage() {
  const { companies, companyMap } = useOutletContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const filteredCompanies = useMemo(
    () => companies.filter((company) => company.toLowerCase().includes(search.toLowerCase())),
    [companies, search]
  );
  const openCompany = (company) => navigate(`/company/${encodeURIComponent(company)}`);

  return (
    <section className="page-shell">
      <div className="page-header">
        <div>
          <div className="eyebrow">Companies</div>
          <h1>Pick a company and start practicing</h1>
          <p>Browse the catalog, open any company, and continue with the existing question page.</p>
        </div>
      </div>

      <div className="surface-card">
        <label className="search-field page-search">
          <span className="sr-only">Search company</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search company..."
          />
        </label>

        <div className="company-grid">
          {filteredCompanies.map((company) => {
            const questionCount = companyMap[company]?.length || 0;
            return (
              <button key={company} type="button" className="company-card" onClick={() => openCompany(company)}>
                <div>
                  <strong>{company}</strong>
                  <span>{questionCount} questions</span>
                </div>
                <ArrowRight size={18} />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ProfilePage() {
  const { dashboard, user, onGoogleLogin, onLogout } = useOutletContext();
  const navigate = useNavigate();

  return (
    <section className="page-shell">
      {user ? (
        <ProfileDashboard
          dashboard={dashboard}
          onBack={() => navigate('/companies')}
          onLogout={onLogout}
          user={user}
          backLabel="Browse companies"
        />
      ) : (
        <div className="surface-card placeholder-panel">
          <div className="eyebrow">Profile</div>
          <h1>Sign in to sync your progress</h1>
          <p>Your profile and solved questions will be restored across devices after Google sign-in.</p>
          <GoogleLoginButton onSuccess={onGoogleLogin} onError={() => {}} />
        </div>
      )}
    </section>
  );
}

function PlaceholderPage({ title, description, icon: Icon }) {
  return (
    <section className="page-shell">
      <div className="surface-card placeholder-panel">
        {Icon && <Icon size={26} />}
        <div className="eyebrow">{title}</div>
        <h1>{title}</h1>
        <p>{description}</p>
        <Link to="/companies" className="primary-button">
          Browse companies
        </Link>
      </div>
    </section>
  );
}

function CompanyPage() {
  const {
    activeFile,
    companyMap,
    companiesLoaded,
    loadCompanyData,
    loading,
    onToggleSolved,
    preferences,
    selectedQuestion,
    setSelectedQuestion,
    setPreferences,
    questions,
    solvedIds,
    solvingQuestionId,
    user,
  } = useOutletContext();
  const { company } = useParams();
  const navigate = useNavigate();
  const companyName = decodeCompanyParam(company);

  // Load once when entering a company route; preference writes happen separately.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!companyName) {
      navigate('/companies', { replace: true });
      return undefined;
    }

    if (!companiesLoaded) {
      return undefined;
    }

    if (!companyMap[companyName]) {
      navigate('/companies', { replace: true });
      return undefined;
    }

    loadCompanyData(companyName, preferences.lastFile).catch(() => {});
  }, [companyName, companyMap, companiesLoaded, loadCompanyData, navigate]);

  if (!companiesLoaded) {
    return (
      <section className="page-shell">
        <div className="surface-card placeholder-panel">
          <div className="eyebrow">Company</div>
          <h1>Loading catalog...</h1>
        </div>
      </section>
    );
  }

  if (!companyMap[companyName]) {
    return null;
  }

  const files = companyMap[companyName] || [];
  const handleFileChange = async (file) => {
    await loadCompanyData(companyName, file.fileName);
  };

  const handleStart = () => {
    navigate('/companies');
  };

  if (selectedQuestion) {
    return (
      <section className="page-shell company-shell">
        <CodeEditor
          question={selectedQuestion}
          onBack={() => setSelectedQuestion(null)}
          onLanguageChange={(language) =>
            setPreferences((current) => {
              const next = { ...current, preferredLanguage: language };
              writeCookiePreferences(next);
              return next;
            })
          }
          preferredLanguage={preferences.preferredLanguage}
        />
      </section>
    );
  }

  return (
    <section className="page-shell company-shell">
        <QuestionTable
        company={companyName}
        files={files}
        activeFile={activeFile}
        questions={questions}
        loading={loading}
        onSelect={setSelectedQuestion}
        onStart={handleStart}
        onFileChange={handleFileChange}
        onPreferenceChange={(patch) =>
          setPreferences((current) => {
            const next = { ...current, ...patch };
            writeCookiePreferences(next);
            return next;
          })
        }
        onToggleSolved={onToggleSolved}
        initialDifficulty={preferences.difficultyFilter}
        initialPage={preferences.currentPage}
        initialSearch={preferences.searchText}
        pageSize={preferences.pageSize}
        solvedIds={solvedIds}
        solvingQuestionId={solvingQuestionId}
        user={user}
      />
    </section>
  );
}

export default function App() {
  const [companyMap, setCompanyMap] = useState({});
  const [companies, setCompanies] = useState([]);
  const [companiesLoaded, setCompaniesLoaded] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activeFile, setActiveFile] = useState('');
  const [preferences, setPreferences] = useState(() => readCookiePreferences());
  const [solvingQuestionId, setSolvingQuestionId] = useState('');
  const [toast, setToast] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  const { dashboard, googleLogin, logout, setDashboard, setUser, user } = useAuth();

  const solvedIds = useMemo(() => new Set(user?.solvedQuestionIds || []), [user?.solvedQuestionIds]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    buildCompanyMap().then((map) => {
      setCompanyMap(map);
      setCompanies(Object.keys(map).sort());
      setCompaniesLoaded(true);
    });
  }, []);

  useEffect(() => {
    const nextPreferences = user?.preferences
      ? { ...defaultPreferences, ...user.preferences }
      : readCookiePreferences();
    setPreferences(nextPreferences);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      return undefined;
    }

    let active = true;

    userApi
      .progress()
      .then((progress) => {
        if (active && progress?.solvedQuestionIds) {
          setUser((currentUser) =>
            currentUser ? { ...currentUser, solvedQuestionIds: progress.solvedQuestionIds } : currentUser
          );
        }
      })
      .catch(() => {
        if (active) {
          showToast('Could not sync solved progress');
        }
      });

    return () => {
      active = false;
    };
  }, [user?.id, setUser]);

  const showToast = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  }, []);

  const refreshDashboard = async () => {
    if (!user) {
      return;
    }

    const payload = await userApi.dashboard();
    setDashboard(payload.dashboard);
  };

  const loadCompanyData = useCallback(
    async (companyName, preferredFileName) => {
      const files = companyMap[companyName] || [];
      const preferredFile = files.find((file) => file.fileName === preferredFileName);
      const fallbackFile = files.find((file) => file.fileName.includes('All')) || files[files.length - 1];
      const nextFile = preferredFile || fallbackFile;

      setSelectedQuestion(null);
      setLoading(true);

      if (!nextFile) {
        setQuestions([]);
        setActiveFile('');
        setLoading(false);
        return null;
      }

      setActiveFile(nextFile.fileName);
      setPreferences((current) => {
        const nextPreferences = {
          ...current,
          lastCompany: companyName,
          lastFile: nextFile.fileName,
          currentPage: 1,
        };
        writeCookiePreferences(nextPreferences);
        return nextPreferences;
      });

      try {
        const data = await loadCSV(companyName, nextFile.fileName);
        setQuestions(data);
        return nextFile.fileName;
      } finally {
        setLoading(false);
      }
    },
    [companyMap, setPreferences]
  );

  const handleToggleSolved = useCallback(
    async (question) => {
      if (!user) {
        setDrawerOpen(true);
        showToast('Sign up with Google to save progress');
        return;
      }

      const questionId = question.questionId;
      const isSolved = solvedIds.has(questionId);
      setSolvingQuestionId(questionId);

      const optimisticSolvedIds = isSolved
        ? user.solvedQuestionIds.filter((id) => id !== questionId)
        : [...user.solvedQuestionIds, questionId];

      setUser({ ...user, solvedQuestionIds: optimisticSolvedIds });

      try {
        const result = isSolved
          ? await questionApi.unmarkSolved(questionId)
          : await questionApi.markSolved(questionId);

        setUser((currentUser) =>
          currentUser ? { ...currentUser, solvedQuestionIds: result.progress.solvedQuestionIds } : currentUser
        );

        refreshDashboard().catch(() => {
          showToast('Solved state updated, but dashboard refresh failed');
        });

        showToast(isSolved ? 'Marked unsolved' : 'Marked solved');
      } catch (error) {
        setUser(user);
        showToast(error.message || 'Could not update solved state');
      } finally {
        setSolvingQuestionId('');
      }
    },
    [refreshDashboard, setUser, solvedIds, showToast, user]
  );

  const handleLogout = useCallback(async () => {
    await logout();
    setDrawerOpen(false);
    showToast('Logged out');
  }, [logout, setDrawerOpen, showToast]);

  const handleAuthSuccess = useCallback((payload) => {
    if (payload?.user?.preferences) {
      setPreferences({ ...defaultPreferences, ...payload.user.preferences });
    }
    setDrawerOpen(false);
    showToast('Signed in');
  }, [setDrawerOpen, setPreferences, showToast]);

  const handleGoogleSuccess = useCallback(
    async (credential) => {
      const result = await googleLogin(credential);
      handleAuthSuccess(result);
    },
    [googleLogin, handleAuthSuccess]
  );

  const outletContext = {
    activeFile,
    companyMap,
    companies,
    companiesLoaded,
    dashboard,
    loadCompanyData,
    loading,
    onToggleSolved: handleToggleSolved,
    onLogout: handleLogout,
    preferences,
    selectedQuestion,
    setPreferences,
    setSelectedQuestion,
    questions,
    solvedIds,
    solvingQuestionId,
    user,
  };

  return (
    <BrowserRouter>
      {toast && <div className="toast">{toast}</div>}

      <Routes>
        <Route
          element={
            <ShellLayout
              drawerOpen={drawerOpen}
              setDrawerOpen={setDrawerOpen}
              theme={theme}
              onThemeToggle={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
              onGoogleLogin={handleGoogleSuccess}
              onGoogleError={() => showToast('Google sign-in failed')}
              onLogout={handleLogout}
              user={user}
              outletContext={outletContext}
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route
            path="settings"
            element={
              <PlaceholderPage
                title="Settings"
                description="Layout and navigation are ready. Settings controls will land here next."
              />
            }
          />
          <Route
            path="bookmarks"
            element={
              <PlaceholderPage
                title="Bookmarks"
                description="Bookmark support will land here next. The shell already keeps this route in place."
                icon={Bookmark}
              />
            }
          />
          <Route path="company/:company" element={<CompanyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
