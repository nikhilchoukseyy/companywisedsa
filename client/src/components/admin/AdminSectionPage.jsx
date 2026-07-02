export default function AdminSectionPage({ title, description }) {
  return (
    <section className="rounded-[24px] border border-border bg-surface p-5 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-6">
      <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">Admin Area</div>
      <h1 className="mt-3 text-[clamp(1.8rem,4vw,2.6rem)] font-black tracking-tight text-text-primary">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-text-secondary">{description}</p>

      <div className="mt-6 rounded-[20px] border border-dashed border-border bg-surface-raised px-5 py-8 text-sm text-text-secondary">
        Placeholder content for {title.toLowerCase()} will live here.
      </div>
    </section>
  );
}
