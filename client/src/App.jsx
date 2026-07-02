import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom';
import { buildCompanyMap, loadCSV } from './utils/csvLoader';
import {
  defaultPreferences,
  readCookiePreferences,
  writeCookiePreferences,
} from './utils/preferences';
import { questionApi, userApi } from './utils/api';
import { useAuth } from './hooks/useAuth';
import HomePage from './components/HomePage';
import ShellLayout from './components/ShellLayout';
import CompaniesPage from './components/CompaniesPage';
import ProfilePage from './components/ProfilePage';
import BookmarksPage from './components/BookmarksPage';
import CompanyPage from './components/CompanyPage';

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

  const showToast = useCallback((message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  }, []);

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
  }, [setUser, showToast, user?.id]);

  const refreshDashboard = async () => {
    if (!user) {
      return;
    }

    const payload = await userApi.dashboard();
    setDashboard(payload.dashboard);
  };

  const loadCompanyData = useCallback(
    async (companyName, preferredFileName) => {
      const companyMeta = companyMap[companyName];
      const files = companyMeta?.files || companyMeta || [];
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

  const handleAuthSuccess = useCallback(
    (payload) => {
      if (payload?.user?.preferences) {
        setPreferences({ ...defaultPreferences, ...payload.user.preferences });
      }
      setDrawerOpen(false);
      showToast('Signed in');
    },
    [setDrawerOpen, setPreferences, showToast]
  );

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
