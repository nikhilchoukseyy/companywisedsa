import { FiArrowRight } from 'react-icons/fi';
import PageSeo from '../PageSeo';

function SectionContent({ section }) {
  return (
    <div className="space-y-4 text-sm leading-7 text-text-secondary">
      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}

      {section.bullets?.length ? (
        <ul className="space-y-2 pl-5">
          {section.bullets.map((item) => (
            <li key={item} className="list-disc">
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      {section.note ? (
        <div className="rounded-[18px] border border-brand/30 bg-brand/10 px-4 py-3 text-sm leading-7 text-text-primary">
          {section.note}
        </div>
      ) : null}
    </div>
  );
}

export default function LegalPageLayout({
  title,
  description,
  updatedAt,
  intro,
  sections,
}) {
  return (
    <>
      <PageSeo title={title} description={description} />

      <section className="mx-auto w-full max-w-[1280px] px-3 py-4 sm:px-6 sm:py-5 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[250px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-[24px] border border-border bg-surface p-4 shadow-[0_24px_60px_rgba(0,0,0,0.2)] sm:p-5">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Legal</div>
              <h2 className="mt-3 text-xl font-black tracking-tight text-text-primary">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-text-secondary">{intro}</p>

              <nav className="mt-6 hidden lg:grid gap-2" aria-label={`${title} sections`}>
                {sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="inline-flex items-center justify-between rounded-2xl border border-border bg-surface-raised px-4 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-brand hover:bg-brand/10 hover:text-brand"
                  >
                    <span>{section.title}</span>
                    <FiArrowRight size={14} />
                  </a>
                ))}
              </nav>

              {updatedAt ? (
                <div className="mt-6 rounded-[20px] border border-border bg-surface-raised px-4 py-3 text-xs text-text-secondary">
                  Last updated
                  <div className="mt-1 text-sm font-semibold text-text-primary">{updatedAt}</div>
                </div>
              ) : null}
            </div>
          </aside>

          <article className="grid gap-5">
            <div className="rounded-[28px] border border-border bg-surface p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-6">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Documentation</div>
              <h1 className="mt-3 text-[clamp(1.8rem,4vw,3rem)] font-black tracking-tight text-text-primary">
                {title}
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-text-secondary">{intro}</p>
            </div>

            {sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="rounded-[24px] border border-border bg-surface p-5 shadow-[0_24px_60px_rgba(0,0,0,0.2)] sm:p-6"
              >
                <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">{section.kicker || title}</div>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-text-primary">{section.title}</h2>
                <div className="mt-4">
                  <SectionContent section={section} />
                </div>
              </section>
            ))}
          </article>
        </div>
      </section>
    </>
  );
}
