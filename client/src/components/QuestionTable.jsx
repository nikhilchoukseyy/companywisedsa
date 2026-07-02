import { useEffect, useState } from 'react';
import { FiBookmark, FiCheckCircle, FiCircle, FiSearch } from 'react-icons/fi';

const DIFF_STYLE = {
  EASY: { text: 'text-easy', bg: 'bg-easy/[0.16]' },
  MEDIUM: { text: 'text-medium', bg: 'bg-medium/[0.16]' },
  HARD: { text: 'text-hard', bg: 'bg-hard/[0.16]' },
};

const FILE_LABELS = {
  '1. Thirty Days.csv': '30 Days',
  '2. Three Months.csv': '3 Months',
  '3. Six Months.csv': '6 Months',
  '4. More Than Six Months.csv': '6M+',
  '5. All.csv': 'All',
};

const PAGE_SIZE = 25;

function getQuestionLink(question) {
  return question?.link || question?.Link || '';
}

function ChipButton({ active, children, ...props }) {
  return (
    <button
      type="button"
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
        active
          ? 'border-brand bg-brand text-page shadow-[0_8px_18px_rgba(255,161,22,0.18)]'
          : 'border-border bg-surface text-text-secondary hover:border-border-strong hover:text-text-primary'
      }`}
      {...props}
    >
      {children}
    </button>
  );
}

function SecondaryButton({ children, className = '', ...props }) {
  return (
    <button
      type="button"
      className={`rounded-md border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-text-primary transition-colors hover:border-border-strong hover:bg-surface-raised disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default function QuestionTable({
  company,
  files,
  activeFile,
  questions,
  loading,
  onStart,
  onFileChange,
  onPreferenceChange,
  onToggleSolved,
  onToggleBookmark,
  initialDifficulty = 'ALL',
  initialPage = 1,
  initialSearch = '',
  pageSize = 25,
  solvedIds = new Set(),
  bookmarkedIds = new Set(),
  solvingQuestionId = '',
  bookmarkingQuestionId = '',
  user,
}) {
  const [search, setSearch] = useState('');
  const [diffFilter, setDiffFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setSearch(initialSearch || '');
  }, [initialSearch]);

  useEffect(() => {
    setDiffFilter(initialDifficulty || 'ALL');
  }, [initialDifficulty]);

  useEffect(() => {
    setCurrentPage(Number(initialPage) || 1);
  }, [initialPage]);

  const filtered = questions.filter((question) => {
    const matchSearch =
      (question.Title || '').toLowerCase().includes(search.toLowerCase()) ||
      (question.Topics || '').toLowerCase().includes(search.toLowerCase());
    const matchDiff = diffFilter === 'ALL' || question.Difficulty === diffFilter;
    return matchSearch && matchDiff;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [company, activeFile, search, diffFilter, questions.length]);

  const effectivePageSize = Number(pageSize) || PAGE_SIZE;
  const totalPages = Math.max(1, Math.ceil(filtered.length / effectivePageSize));
  const pageStart = (currentPage - 1) * effectivePageSize;
  const pageQuestions = filtered.slice(pageStart, pageStart + effectivePageSize);

  const updateSearch = (value) => {
    setSearch(value);
    onPreferenceChange?.({ searchText: value, currentPage: 1 });
  };

  const updateDifficulty = (value) => {
    setDiffFilter(value);
    onPreferenceChange?.({ difficultyFilter: value, currentPage: 1 });
  };

  const updatePage = (nextPage) => {
    setCurrentPage(nextPage);
    onPreferenceChange?.({ currentPage: nextPage });
  };

  const clearFilters = () => {
    setSearch('');
    setDiffFilter('ALL');
    setCurrentPage(1);
    onPreferenceChange?.({ searchText: '', difficultyFilter: 'ALL', currentPage: 1 });
  };

  if (!company) {
    return (
      <section className="mx-auto flex max-w-[560px] flex-col items-center gap-4 px-4 py-20 text-center">
        <button
          type="button"
          onClick={onStart}
          className="rounded-full border border-brand bg-brand/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-brand hover:bg-brand/20"
        >
          Start
        </button>
        <h1 className="text-2xl font-bold text-text-primary">Select a company to explore questions</h1>
        <p className="text-sm leading-relaxed text-text-secondary">
          Search from the company list, open a time range, and jump straight into the practice
          set that matches your prep window.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-[1200px] px-3 py-4 text-text-primary sm:px-4 sm:py-5 md:px-6">
      {/* Toolbar */}
      <div className="mb-5 flex flex-col gap-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand">
              <FiBookmark size={14} aria-hidden="true" />
              <span>Company question bank</span>
            </div>
            <h2 className="truncate text-lg font-bold sm:text-xl">{company}</h2>
          </div>

          <div role="tablist" aria-label="Question range" className="flex w-full flex-wrap gap-2 sm:w-auto">
            {files.map((file) => (
              <ChipButton
                key={file.fileName}
                active={activeFile === file.fileName}
                onClick={() => onFileChange(file)}
              >
                {FILE_LABELS[file.fileName] || file.fileName}
              </ChipButton>
            ))}
          </div>

          <span className="text-xs text-text-muted sm:self-center">
            {filtered.length} / {questions.length} questions
          </span>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search questions</span>
            <FiSearch
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
              size={15}
              aria-hidden="true"
            />
            <input
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search by title or topic..."
              className="w-full rounded-md border border-border bg-surface py-2 pl-9 pr-3 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none"
            />
          </label>

          <div className="flex flex-wrap gap-2 sm:justify-end">
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((difficulty) => (
              <ChipButton
                key={difficulty}
                active={diffFilter === difficulty}
                onClick={() => updateDifficulty(difficulty)}
              >
                {difficulty}
              </ChipButton>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface">
        {loading ? (
          <div className="px-4 py-12 text-center text-sm text-text-secondary sm:px-6 sm:py-16">Loading questions...</div>
        ) : filtered.length === 0 ? (
          <div className="px-4 py-12 sm:px-6 sm:py-16">
            <div className="mx-auto flex max-w-lg flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface-raised px-5 py-8 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-brand/30 bg-brand/10 text-brand">
                <FiSearch size={18} />
              </div>
              <h3 className="text-base font-bold text-text-primary">No questions match the current filters</h3>
              <p className="text-sm leading-6 text-text-secondary">
                Clear the search or difficulty filter to bring the full question list back.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-page transition-colors hover:bg-brand-light"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-full overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-text-muted">
                  {['#', 'Status', 'Difficulty', 'Title', 'Frequency', 'Acceptance', 'Topics', 'Action'].map(
                    (heading) => (
                      <th key={heading} className="px-4 py-3 font-semibold">
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {pageQuestions.map((question, index) => {
                  const diff = (question.Difficulty || '').toUpperCase();
                  const diffStyle = DIFF_STYLE[diff] || { text: 'text-text-secondary', bg: 'bg-surface-raised' };
                  const frequency = parseFloat(question.Frequency || 0).toFixed(1);
                  const acceptance = parseFloat(question['Acceptance Rate'] || 0);
                  const acceptancePct =
                    acceptance < 1 ? (acceptance * 100).toFixed(1) : acceptance.toFixed(1);
                  const isSolved = solvedIds.has(question.questionId);
                  const isBookmarked = bookmarkedIds.has(question.questionId);
                  const questionLink = getQuestionLink(question);

                  return (
                    <tr
                      key={question.questionId || index}
                      className="border-b border-border last:border-b-0 hover:bg-surface-raised"
                    >
                      <td className="px-4 py-3 text-text-muted">{pageStart + index + 1}</td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          disabled={solvingQuestionId === question.questionId}
                          onClick={() => onToggleSolved?.(question)}
                          title={user ? 'Toggle solved state' : 'Sign up with Google to save progress'}
                          aria-label={
                            isSolved
                              ? `Mark ${question.Title || 'question'} as unsolved`
                              : `Mark ${question.Title || 'question'} as solved`
                          }
                          className={`flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold transition-colors disabled:opacity-40 ${
                            isSolved
                              ? 'text-easy'
                              : 'text-text-muted hover:text-text-primary'
                          }`}
                        >
                          {isSolved ? (
                            <>
                              <FiCheckCircle size={18} />
                              <span>Solved</span>
                            </>
                          ) : (
                            <>
                              <FiCircle size={18} />
                              <span>Solve</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${diffStyle.text} ${diffStyle.bg}`}
                        >
                          {diff}
                        </span>
                      </td>
                      <td className="max-w-[260px] px-4 py-3 font-medium">
                        <div className="flex items-center gap-2">
                          <span className="min-w-0 flex-1 truncate">{question.Title}</span>
                          <button
                            type="button"
                            disabled={bookmarkingQuestionId === question.questionId}
                            onClick={() => onToggleBookmark?.(question)}
                            title={user ? 'Toggle bookmark' : 'Sign up with Google to save bookmarks'}
                            aria-label={
                              isBookmarked
                                ? `Remove ${question.Title || 'question'} from bookmarks`
                                : `Add ${question.Title || 'question'} to bookmarks`
                            }
                            className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-40 ${
                              isBookmarked
                                ? 'border-brand/40 bg-brand/15 text-brand'
                                : 'border-border bg-surface text-text-muted hover:border-brand hover:bg-brand/10 hover:text-brand'
                            }`}
                          >
                            <FiBookmark size={16} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-text-secondary">{frequency}</td>
                      <td className="px-4 py-3 text-text-secondary">{acceptancePct}%</td>
                      <td
                        className="max-w-[220px] truncate px-4 py-3 text-text-secondary"
                        title={question.Topics}
                      >
                        {question.Topics}
                      </td>
                      <td className="px-4 py-3">
                        {questionLink ? (
                          <a
                            href={questionLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center rounded-full border border-brand/30 bg-brand/10 px-3.5 py-1.5 text-sm font-semibold text-brand transition-colors hover:border-brand hover:bg-brand/15"
                          >
                            Solve
                          </a>
                        ) : (
                          <span className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm font-semibold text-text-muted">
                            No source
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && filtered.length > 0 && (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="text-xs text-text-muted">
            Showing {pageStart + 1}-{Math.min(pageStart + effectivePageSize, filtered.length)} of{' '}
            {filtered.length}
          </div>

          <div className="flex items-center gap-3">
            <SecondaryButton
              onClick={() => updatePage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </SecondaryButton>

            <span className="text-xs font-medium text-text-secondary">
              Page {currentPage} of {totalPages}
            </span>

            <SecondaryButton
              onClick={() => updatePage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </SecondaryButton>
          </div>
        </div>
      )}
    </section>
  );
}

