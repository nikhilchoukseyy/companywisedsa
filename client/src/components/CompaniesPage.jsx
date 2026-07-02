import { useMemo, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { useNavigate, useOutletContext } from 'react-router-dom';

export default function CompaniesPage() {
  const { companies, companyMap } = useOutletContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const filteredCompanies = useMemo(
    () => companies.filter((company) => company.toLowerCase().includes(search.toLowerCase())),
    [companies, search]
  );
  const totalCompanies = companies.length;
  const visibleCompanies = filteredCompanies.length;
  const openCompany = (company) => navigate(`/company/${encodeURIComponent(company)}`);

  return (
    <section className="mx-auto flex w-full max-w-[1280px] flex-col gap-5 overflow-x-hidden px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
      <div className="flex flex-col gap-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Companies</div>
        <h1 className="text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight text-text-primary">
          Pick a company and start practicing
        </h1>
        <p className="max-w-3xl text-sm leading-7 text-text-secondary">
          Browse the catalog, open any company, and continue with the existing question page.
        </p>
        <div className="mt-2 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs font-semibold text-text-secondary">
          <span>{totalCompanies}+ companies total</span>
        </div>
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
            const companyMeta = companyMap[company];
            const questionCount = companyMeta?.questionCount ?? companyMeta?.length ?? 0;
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
                  <span className="mt-2 inline-flex items-center rounded-full border border-border bg-page px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">
                    {questionCount} questions
                  </span>
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
