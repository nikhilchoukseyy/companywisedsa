import { useState } from 'react';

export default function CompanyList({ companies, selected, onSelect, onClose }) {
  const [search, setSearch] = useState('');
  const filtered = companies.filter((company) =>
    company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="company-list">
      <div className="company-list-header">
        <div className="company-list-brand-row">
          <div>
            <div className="company-list-eyebrow">Interview practice workspace</div>
            <div className="company-list-title">DSA Prep</div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="icon-button mobile-close-btn"
              aria-label="Close company list"
            >
              Close
            </button>
          )}
        </div>

        <label className="search-field">
          <span className="sr-only">Search company</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search company..."
          />
        </label>

        <div className="company-list-meta">{filtered.length} companies</div>
      </div>

      <div className="company-list-scroll">
        {filtered.map((company) => (
          <button
            key={company}
            type="button"
            onClick={() => onSelect(company)}
            className={`company-list-item ${selected === company ? 'is-active' : ''}`}
          >
            <span>{company}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
