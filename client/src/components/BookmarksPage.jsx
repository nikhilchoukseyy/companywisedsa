import { useEffect, useState } from 'react';
import { FiBookmark } from 'react-icons/fi';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { userApi } from '../utils/api';
import GoogleLoginButton from './GoogleLoginButton';

export default function BookmarksPage() {
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
