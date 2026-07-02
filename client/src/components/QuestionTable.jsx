import { useEffect, useState } from 'react';

const DIFF_STYLE = {
  EASY: { color: '#3fb950', background: 'rgba(63, 185, 80, 0.16)' },
  MEDIUM: { color: '#d29922', background: 'rgba(210, 153, 34, 0.16)' },
  HARD: { color: '#f85149', background: 'rgba(248, 81, 73, 0.16)' },
};

const FILE_LABELS = {
  '1. Thirty Days.csv': '30 Days',
  '2. Three Months.csv': '3 Months',
  '3. Six Months.csv': '6 Months',
  '4. More Than Six Months.csv': '6M+',
  '5. All.csv': 'All',
};

const PAGE_SIZE = 25;

export default function QuestionTable({
  company,
  files,
  activeFile,
  questions,
  loading,
  onSelect,
  onStart,
  onFileChange,
  onPreferenceChange,
  onToggleSolved,
  initialDifficulty = 'ALL',
  initialPage = 1,
  initialSearch = '',
  pageSize = 25,
  solvedIds = new Set(),
  solvingQuestionId = '',
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

  if (!company) {
    return (
      <section className="empty-state">
        <button type="button" className="empty-state-badge empty-state-action" onClick={onStart}>
          Start
        </button>
        <h1>Select a company to explore questions</h1>
        <p>
          Search from the company list, open a time range, and jump straight into the
          practice set that matches your prep window.
        </p>
      </section>
    );
  }

  return (
    <section className="question-view">
      <div className="question-toolbar">
        <div className="question-toolbar-top">
          <div className="question-heading">
            <div className="question-heading-eyebrow">Company question bank</div>
            <h2>{company}</h2>
          </div>

          <div className="file-tabs" role="tablist" aria-label="Question range">
            {files.map((file) => (
              <button
                key={file.fileName}
                type="button"
                onClick={() => onFileChange(file)}
                className={`chip-button ${activeFile === file.fileName ? 'is-active' : ''}`}
              >
                {FILE_LABELS[file.fileName] || file.fileName}
              </button>
            ))}
          </div>

          <span className="question-count">
            {filtered.length} / {questions.length} questions
          </span>
        </div>

        <div className="question-filters">
          <label className="search-field search-field-wide">
            <span className="sr-only">Search questions</span>
            <input
              value={search}
              onChange={(event) => updateSearch(event.target.value)}
              placeholder="Search by title or topic..."
            />
          </label>

          <div className="filter-chip-row">
            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((difficulty) => (
              <button
                key={difficulty}
                type="button"
                onClick={() => updateDifficulty(difficulty)}
                className={`chip-button ${diffFilter === difficulty ? 'is-active' : ''}`}
              >
                {difficulty}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="question-table-wrap">
        {loading ? (
          <div className="status-panel">Loading questions...</div>
        ) : (
          <div className="table-scroll">
            <table className="question-table">
              <thead>
                <tr>
                  {['#', 'Status', 'Difficulty', 'Title', 'Frequency', 'Acceptance', 'Topics', 'Action'].map(
                    (heading) => (
                      <th key={heading}>{heading}</th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {pageQuestions.map((question, index) => {
                  const diff = (question.Difficulty || '').toUpperCase();
                  const diffStyle = DIFF_STYLE[diff] || {};
                  const frequency = parseFloat(question.Frequency || 0).toFixed(1);
                  const acceptance = parseFloat(question['Acceptance Rate'] || 0);
                  const acceptancePct =
                    acceptance < 1 ? (acceptance * 100).toFixed(1) : acceptance.toFixed(1);

                  return (
                    <tr key={question.questionId || index}>
                      <td className="muted-cell" data-label="#">
                        {pageStart + index + 1}
                      </td>
                      <td data-label="Status">
                        <button
                          type="button"
                          className={`solved-toggle ${solvedIds.has(question.questionId) ? 'is-solved' : ''}`}
                          disabled={solvingQuestionId === question.questionId}
                          onClick={() => onToggleSolved?.(question)}
                          title={user ? 'Toggle solved state' : 'Log in to save solved questions'}
                        >
                          {solvedIds.has(question.questionId) ? 'Solved' : 'Unsolved'}
                        </button>
                      </td>
                      <td data-label="Difficulty">
                        <span className="difficulty-pill" style={diffStyle}>
                          {diff}
                        </span>
                      </td>
                      <td className="question-title-cell" data-label="Title">
                        {question.Title}
                      </td>
                      <td className="muted-cell" data-label="Frequency">
                        {frequency}
                      </td>
                      <td className="muted-cell" data-label="Acceptance">
                        {acceptancePct}%
                      </td>
                      <td className="topics-cell" title={question.Topics} data-label="Topics">
                        {question.Topics}
                      </td>
                      <td data-label="Action">
                        <button
                          type="button"
                          onClick={() => onSelect(question)}
                          className="secondary-button"
                        >
                          Solve
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <div className="pagination-bar">
          <div className="pagination-summary">
            Showing {pageStart + 1}-{Math.min(pageStart + effectivePageSize, filtered.length)} of {filtered.length}
          </div>

          <div className="pagination-controls">
            <button
              type="button"
              className="secondary-button"
              onClick={() => updatePage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className="pagination-page">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              className="secondary-button"
              onClick={() => updatePage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
