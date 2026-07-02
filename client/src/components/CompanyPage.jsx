import { useEffect } from 'react';
import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import QuestionTable from './QuestionTable';
import { writeCookiePreferences } from '../utils/preferences';
import {
  trackCompanyViewed,
  trackQuestionListRange,
} from '../utils/analytics';

function decodeCompanyParam(value) {
  try {
    return decodeURIComponent(value || '');
  } catch {
    return value || '';
  }
}

export default function CompanyPage() {
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

    trackCompanyViewed(companyName);
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

  const files = companyMap[companyName]?.files || companyMap[companyName] || [];
  const handleFileChange = async (file) => {
    trackQuestionListRange(companyName, file.fileName);
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
