import { useEffect, useMemo, useState } from 'react';
import { buildCompanyMap, loadCSV } from './utils/csvLoader';
import { defaultPreferences, readCookiePreferences, writeCookiePreferences } from './utils/preferences';
import { userApi } from './utils/api';
import { useAuth } from './hooks/useAuth';
import AuthPanel from './components/AuthPanel';
import CodeEditor from './components/CodeEditor';
import CompanyList from './components/CompanyList';
import ProfileDashboard from './components/ProfileDashboard';
import QuestionTable from './components/QuestionTable';
import GoogleLoginButton from "./components/GoogleLoginButton";
export default function App() {
  const [companyMap, setCompanyMap] = useState({});
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [activeFile, setActiveFile] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [view, setView] = useState('questions');
  const [preferences, setPreferences] = useState(() => readCookiePreferences());
  const [solvingQuestionId, setSolvingQuestionId] = useState('');
  const [toast, setToast] = useState('');

  const {
    dashboard,
    loadingUser,
    googleLogin,
    login,
    logout,
    register,
    setDashboard,
    setUser,
    user,
  } = useAuth();

  const solvedIds = useMemo(
    () => new Set(user?.solvedQuestionIds || []),
    [user?.solvedQuestionIds]
  );

  useEffect(() => {
    buildCompanyMap().then((map) => {
      setCompanyMap(map);
      setCompanies(Object.keys(map).sort());
    });
  }, []);

  useEffect(() => {
    const nextPreferences = user?.preferences
      ? { ...defaultPreferences, ...user.preferences }
      : readCookiePreferences();
    setPreferences(nextPreferences);
  }, [user?.id]);

  useEffect(() => {
    if (!companies.length || selectedCompany) {
      return;
    }

    const preferredCompany = preferences.lastCompany;
    if (preferredCompany && companyMap[preferredCompany]) {
      handleCompanySelect(preferredCompany, preferences.lastFile);
    }
  }, [companies.length, companyMap, preferences.lastCompany, preferences.lastFile, selectedCompany]);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };

  const persistPreferences = (patch) => {
    const nextPreferences = { ...preferences, ...patch };
    setPreferences(nextPreferences);
    writeCookiePreferences(nextPreferences);

    if (user) {
      userApi.savePreferences(patch).catch(() => {
        showToast('Could not save preferences');
      });
    }
  };

  const handleCompanySelect = async (companyName, preferredFileName) => {
    setSelectedCompany(companyName);
    setSelectedQuestion(null);
    setLoading(true);
    setSidebarOpen(false);
    setView('questions');

    const files = companyMap[companyName] || [];
    const preferredFile = files.find((file) => file.fileName === preferredFileName);
    const allFile = files.find((file) => file.fileName.includes('All')) || files[files.length - 1];
    const nextFile = preferredFile || allFile;

    if (!nextFile) {
      setQuestions([]);
      setLoading(false);
      return;
    }

    setActiveFile(nextFile.fileName);
    persistPreferences({ lastCompany: companyName, lastFile: nextFile.fileName, currentPage: 1 });

    const data = await loadCSV(companyName, nextFile.fileName);
    setQuestions(data);
    setLoading(false);
  };

  const handleFileChange = async (fileName) => {
    setActiveFile(fileName);
    setLoading(true);
    persistPreferences({ lastFile: fileName, currentPage: 1 });
    const data = await loadCSV(selectedCompany, fileName);
    setQuestions(data);
    setLoading(false);
  };

  const handleToggleSolved = async (question) => {
    if (!user) {
      setAuthOpen(true);
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
        ? await userApi.unmarkSolved(questionId)
        : await userApi.markSolved(questionId);

      setUser((currentUser) =>
        currentUser ? { ...currentUser, solvedQuestionIds: result.solvedQuestionIds } : currentUser
      );
      setDashboard(result.dashboard);
      showToast(isSolved ? 'Marked unsolved' : 'Marked solved');
    } catch (error) {
      setUser(user);
      showToast(error.message || 'Could not update solved state');
    } finally {
      setSolvingQuestionId('');
    }
  };

  const handleLogout = async () => {
    await logout();
    setView('questions');
    showToast('Logged out');
  };

  const handleAuthSuccess = (payload) => {
    if (payload?.user?.preferences) {
      setPreferences({ ...defaultPreferences, ...payload.user.preferences });
    }
    showToast('Signed in');
  };

  return (
    <div className="app-shell">
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="mobile-overlay" />}
      {authOpen && (
        <AuthPanel
          onClose={() => setAuthOpen(false)}
          onLogin={async (payload) => {
            const result = await login(payload);
            handleAuthSuccess(result);
          }}
          onRegister={async (payload) => {
            const result = await register(payload);
            handleAuthSuccess(result);
          }}
        />
      )}
      {toast && <div className="toast">{toast}</div>}

      <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <CompanyList
          companies={companies}
          selected={selectedCompany}
          onSelect={handleCompanySelect}
          onClose={() => setSidebarOpen(false)}
        />
      </div>

      <main className="app-main">
        <div className="mobile-header">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="icon-button hamburger-button"
            aria-label="Open company list"
          >
            <span />
            <span />
            <span />
          </button>
          <span className="mobile-header-title">DSA Prep</span>
        </div>

        <div className="app-topbar">
          <strong>DSA Prep</strong>
          <div className="topbar-actions">
            {loadingUser ? (
              <span className="muted-inline">Checking session...</span>
            ) : user ? (
              <>
                <button type="button" className="secondary-button" onClick={() => setView('profile')}>
                  Profile
                </button>
                <button type="button" className="secondary-button" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <button type="button" className="primary-button" onClick={() => setAuthOpen(true)}>
                Login / Signup
              </button>
            )}
          </div>
        </div>

        {view === 'profile' ? (
          <ProfileDashboard
            dashboard={dashboard}
            onBack={() => setView('questions')}
            onLogout={handleLogout}
            user={user}
          />
        ) : selectedQuestion ? (
          <CodeEditor
            question={selectedQuestion}
            onBack={() => setSelectedQuestion(null)}
            onLanguageChange={(language) => persistPreferences({ preferredLanguage: language })}
            preferredLanguage={preferences.preferredLanguage}
          />
        ) : (
          <QuestionTable
            company={selectedCompany}
            files={selectedCompany ? companyMap[selectedCompany] : []}
            activeFile={activeFile}
            questions={questions}
            loading={loading}
            onSelect={setSelectedQuestion}
            onStart={() => setSidebarOpen(true)}
            onFileChange={(file) => handleFileChange(file.fileName)}
            onPreferenceChange={persistPreferences}
            onToggleSolved={handleToggleSolved}
            initialDifficulty={preferences.difficultyFilter}
            initialPage={preferences.currentPage}
            initialSearch={preferences.searchText}
            pageSize={preferences.pageSize}
            solvedIds={solvedIds}
            solvingQuestionId={solvingQuestionId}
            user={user}
          />
        )}
        <GoogleLoginButton
          onSuccess={async (credential) => {
            const result = await googleLogin(credential);
            handleAuthSuccess(result);
          }}
          onError={(error) => {
            showToast(error.message || 'Google sign-in failed');
          }}
        />
      </main>
    </div>
  );
}
