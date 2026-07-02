import { Link } from 'react-router-dom';

export default function PlaceholderPage({ title, description, icon: Icon }) {
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
