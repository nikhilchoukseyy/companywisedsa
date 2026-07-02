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
import { FiArrowRight, FiBookmark } from 'react-icons/fi';
import { buildCompanyMap, loadCSV } from './utils/csvLoader';
import { defaultPreferences, readCookiePreferences, writeCookiePreferences } from './utils/preferences';
import { questionApi, userApi } from './utils/api';
import { useAuth } from './hooks/useAuth';
import HomePage from './components/HomePage';
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
    <div className="min-h-screen overflow-x-hidden bg-page text-text-primary">
      <AppNavbar
        onMenuClick={() => setDrawerOpen(true)}
        onGoogleLogin={onGoogleLogin}
        onGoogleError={onGoogleError}
        onLogout={onLogout}
        user={user}
      />

      <AppDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onGoogleLogin={onGoogleLogin}
        onGoogleError={onGoogleError}
        onLogout={onLogout}
        user={user}
      />

      <main className="w-full overflow-x-hidden">
        <Outlet context={outletContext} />
      </main>
    </div>
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
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
          Companies
        </div>
        <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight text-text-primary">
          Pick a company and start practicing
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-text-secondary">
          Browse the catalog, open any company, and continue with the existing question page.
        </p>
      </div>

      <div className="overflow-x-hidden rounded-[24px] border border-border bg-surface p-4 sm:p-5">
        <label className="relative block">
          <span className="sr-only">Search company</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search company..."
            className="w-full rounded-full border border-border bg-page px-4 py-3 text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-brand"
          />
        </label>

        <div className="mt-5 grid grid-cols-1 gap-3 min-[520px]:grid-cols-2 xl:grid-cols-3">
          {filteredCompanies.map((company) => {
            const questionCount = companyMap[company]?.length || 0;
            return (
              <button
                key={company}
                type="button"
                className="flex w-full min-w-0 items-start justify-between gap-3 rounded-[18px] border border-border bg-surface-raised px-4 py-4 text-left transition-colors hover:border-brand hover:bg-brand/10"
                onClick={() => openCompany(company)}
              >
                <div className="min-w-0 flex-1">
                  <strong className="block break-words text-sm font-bold leading-snug text-text-primary sm:truncate">
                    {company}
                  </strong>
                  <span className="mt-1 block text-xs text-text-secondary">{questionCount} questions</span>
                </div>
                <FiArrowRight className="mt-0.5 shrink-0 text-brand" size={18} />
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

function BookmarksPage() {
  const { user, onGoogleLogin, onToggleBookmark } = useOutletContext();
  const [bookmarks, setBookmarks] = useState([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);
  const [bookmarkError, setBookmarkError] = useState('');
  const navigate = useNavigate();
  const bookmarkedKey = (user?.bookmarkedQuestionIds || []).join('|');

  useEffect(() => {
    if (!user?.id) {
      setBookmarks([]);
      return undefined;
    }

    let active = true;
    setLoadingBookmarks(true);
    setBookmarkError('');

    userApi
      .bookmarks()
      .then((payload) => {
        if (active) {
          setBookmarks(payload?.bookmarkedQuestions || []);
        }
      })
      .catch((error) => {
        if (active) {
          setBookmarkError(error.message || 'Could not load bookmarks');
        }
      })
      .finally(() => {
        if (active) {
          setLoadingBookmarks(false);
        }
      });

    return () => {
      active = false;
    };
  }, [user?.id, bookmarkedKey]);

  return (
    <section className="mx-auto w-full max-w-[1280px] px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
      {user ? (
        <div className="rounded-[24px] border border-border bg-surface p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-5">
          <div className="mb-5 flex flex-col gap-2">
            <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Bookmarks</div>
            <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight text-text-primary">
              Saved questions
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-text-secondary">
              Tap the bookmark icon on any question to save it here and remove it later.
            </p>
          </div>

          {loadingBookmarks ? (
            <div className="rounded-2xl border border-border bg-surface-raised px-5 py-16 text-center text-sm text-text-secondary">
              Loading bookmarks...
            </div>
          ) : bookmarkError ? (
            <div className="rounded-2xl border border-border bg-surface-raised px-5 py-8 text-sm text-text-secondary">
              {bookmarkError}
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface-raised px-5 py-8 text-sm text-text-secondary">
              No bookmarked questions yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {bookmarks.map((question) => (
                <article
                  key={question.questionId}
                  className="flex h-full flex-col rounded-[20px] border border-border bg-surface-raised p-4 sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                    <div className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
                      <FiBookmark size={14} className="text-brand" />
                      <span>Saved question</span>
                    </div>
                      <h2 className="text-lg font-bold leading-snug text-text-primary">{question.title}</h2>
                    </div>
                    <button
                      type="button"
                      className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brand/40 bg-brand/15 text-brand transition-colors hover:border-brand hover:bg-brand/20"
                      onClick={() => onToggleBookmark?.(question)}
                      aria-label={`Remove ${question.title} from bookmarks`}
                    >
                      <FiBookmark size={18} />
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-text-secondary">
                    <span className="rounded-full border border-border bg-surface px-3 py-1 font-semibold text-text-primary">
                      {question.difficulty}
                    </span>
                    <span className="rounded-full border border-border bg-surface px-3 py-1">
                      {question.companies?.join(', ') || 'Unknown company'}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {question.companies?.[0] && (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-4 py-2.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface-raised"
                        onClick={() => navigate(`/company/${encodeURIComponent(question.companies[0])}`)}
                      >
                        Open company
                      </button>
                    )}
                    {question.link && (
                      <a
                        className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-page transition-colors hover:bg-brand-light"
                        href={question.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open question
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-[24px] border border-border bg-surface p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Bookmarks</div>
          <h1 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight text-text-primary">
            Sign in to save bookmarks
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">
            Your bookmarked questions will be synced across devices after Google sign-in.
          </p>
          <div className="mt-5">
            <GoogleLoginButton onSuccess={onGoogleLogin} onError={() => {}} />
          </div>
        </div>
      )}
    </section>
  );
}

function PlaceholderPage({ title, description, icon: Icon }) {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="rounded-[24px] border border-border bg-surface p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-6">
        {Icon && <Icon size={26} className="text-brand" />}
        <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{title}</div>
        <h1 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight text-text-primary">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">{description}</p>
        <Link
          to="/companies"
          className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-brand px-5 py-3 text-sm font-bold text-page transition-colors hover:bg-brand-light sm:w-auto"
        >
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
    onToggleBookmark,
    onToggleSolved,
    preferences,
    setPreferences,
    questions,
    bookmarkedIds,
    bookmarkingQuestionId,
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
      <section className="mx-auto w-full max-w-[1280px] px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="rounded-[24px] border border-border bg-surface p-4 shadow-[0_24px_60px_rgba(0,0,0,0.35)] sm:p-6">
          <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Company</div>
          <h1 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight text-text-primary">
            Loading catalog...
          </h1>
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

  return (
    <section className="mx-auto w-full max-w-[1280px] px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
      <QuestionTable
        company={companyName}
        files={files}
        activeFile={activeFile}
        questions={questions}
        loading={loading}
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
        onToggleBookmark={onToggleBookmark}
        initialDifficulty="ALL"
        initialPage={1}
        initialSearch=""
        pageSize={preferences.pageSize}
        bookmarkedIds={bookmarkedIds}
        bookmarkingQuestionId={bookmarkingQuestionId}
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
  const [activeFile, setActiveFile] = useState('');
  const [preferences, setPreferences] = useState(() => readCookiePreferences());
  const [solvingQuestionId, setSolvingQuestionId] = useState('');
  const [bookmarkingQuestionId, setBookmarkingQuestionId] = useState('');
  const [toast, setToast] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { dashboard, googleLogin, logout, setDashboard, setUser, user } = useAuth();

  const solvedIds = useMemo(() => new Set(user?.solvedQuestionIds || []), [user?.solvedQuestionIds]);
  const bookmarkedIds = useMemo(() => new Set(user?.bookmarkedQuestionIds || []), [user?.bookmarkedQuestionIds]);

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

  const handleToggleBookmark = useCallback(
    async (question) => {
      if (!user) {
        setDrawerOpen(true);
        showToast('Sign up with Google to save bookmarks');
        return;
      }

      const questionId = question.questionId;
      const isBookmarked = bookmarkedIds.has(questionId);
      setBookmarkingQuestionId(questionId);

      const optimisticBookmarkedIds = isBookmarked
        ? user.bookmarkedQuestionIds.filter((id) => id !== questionId)
        : [...user.bookmarkedQuestionIds, questionId];

      setUser({ ...user, bookmarkedQuestionIds: optimisticBookmarkedIds });

      try {
        const result = isBookmarked
          ? await questionApi.unmarkBookmarked(questionId)
          : await questionApi.markBookmarked(questionId);

        setUser((currentUser) =>
          currentUser
            ? { ...currentUser, bookmarkedQuestionIds: result.progress.bookmarkedQuestionIds }
            : currentUser
        );

        refreshDashboard().catch(() => {
          showToast('Bookmark updated, but dashboard refresh failed');
        });

        showToast(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
      } catch (error) {
        setUser(user);
        showToast(error.message || 'Could not update bookmark');
      } finally {
        setBookmarkingQuestionId('');
      }
    },
    [bookmarkedIds, refreshDashboard, setUser, showToast, user]
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
    onToggleBookmark: handleToggleBookmark,
    onToggleSolved: handleToggleSolved,
    onLogout: handleLogout,
    preferences,
    setPreferences,
    questions,
    bookmarkedIds,
    bookmarkingQuestionId,
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
          <Route path="bookmarks" element={<BookmarksPage />} />
          <Route path="company/:company" element={<CompanyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


