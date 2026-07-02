import { FiMessageSquare, FiStar, FiUsers } from 'react-icons/fi';

const REVIEWS = [
  {
    reviewerName: 'Ananya Gupta',
    review:
      'The company cards make it easy to jump into a specific employer and continue the exact question set I want to practice.',
    starRating: 5,
    accent: 'brand',
  },
  {
    reviewerName: 'Aarav Mehta',
    review:
      'Solved tracking keeps my progress stored across refreshes and devices, which makes returning to prep sessions really smooth.',
    starRating: 5,
    accent: 'easy',
  },
  {
    reviewerName: 'Priya Sharma',
    review:
      'The question table keeps difficulty, topics, and source links in one place so I can scan and choose quickly.',
    starRating: 5,
    accent: 'medium',
  },
  {
    reviewerName: 'Rahul Verma',
    review:
      'Bookmarking questions lets me save the ones I want to revisit later without losing them in the bigger catalog.',
    starRating: 5,
    accent: 'hard',
  },
  {
    reviewerName: 'Sneha Iyer',
    review:
      'The navigation makes it simple to switch between companies and return to the same catalog flow every time.',
    starRating: 5,
    accent: 'brand',
  },
];

const ACCENT_STYLES = {
  brand: {
    ring: 'border-brand/25',
    glow: 'bg-brand/10',
    badge: 'bg-brand/10 text-brand',
    dot: 'bg-brand',
    shadow: 'rgba(255,161,22,0.14)',
  },
  easy: {
    ring: 'border-easy/25',
    glow: 'bg-easy/10',
    badge: 'bg-easy/10 text-easy',
    dot: 'bg-easy',
    shadow: 'rgba(44,187,93,0.14)',
  },
  medium: {
    ring: 'border-medium/25',
    glow: 'bg-medium/10',
    badge: 'bg-medium/10 text-medium',
    dot: 'bg-medium',
    shadow: 'rgba(255,184,0,0.14)',
  },
  hard: {
    ring: 'border-hard/25',
    glow: 'bg-hard/10',
    badge: 'bg-hard/10 text-hard',
    dot: 'bg-hard',
    shadow: 'rgba(239,71,67,0.14)',
  },
};

function getInitials(name = '') {
  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 0) {
    return 'P';
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

function ReviewCard({ review }) {
  const accent = ACCENT_STYLES[review.accent] || ACCENT_STYLES.brand;
  const initials = getInitials(review.reviewerName);

  return (
    <article
      className={`relative flex h-full w-[min(84vw,340px)] shrink-0 overflow-hidden rounded-[24px] border ${accent.ring} bg-surface p-4 shadow-[0_18px_36px_rgba(0,0,0,0.28)] sm:w-[320px] sm:p-5`}
      style={{ boxShadow: `0 22px 48px ${accent.shadow}` }}
    >
      <div className={`pointer-events-none absolute inset-x-4 top-0 h-16 rounded-b-full blur-3xl ${accent.glow}`} />

      <div className="relative z-10 flex min-h-full w-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border ${accent.ring} ${accent.glow} text-sm font-black text-text-primary`}
            >
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-text-primary">{review.reviewerName}</p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-0.5 pt-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <FiStar
                key={`${review.reviewerName}-star-${index}`}
                size={13}
                className={index < review.starRating ? 'text-brand' : 'text-text-muted'}
              />
            ))}
          </div>
        </div>

        <div className="flex min-h-[140px] flex-1 rounded-[20px] border border-border bg-page/70 p-4">
          <p className="text-sm leading-7 text-text-secondary">{review.review}</p>
        </div>
      </div>
    </article>
  );
}

export default function ReviewMarquee() {
  const loopedReviews = [...REVIEWS, ...REVIEWS];

  return (
    <section className="w-full">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
              <FiUsers size={14} />
              <span>Community feedback</span>
            </div>
            <h2 className="mt-2 text-lg font-bold text-text-primary sm:text-[22px]">
              What learners are saying
            </h2>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-xs text-text-secondary">
            <FiMessageSquare size={13} className="text-brand" />
            Community feedback
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-[28px] border border-border bg-surface p-4 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:p-5">
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-page via-page/90 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-page via-page/90 to-transparent" />

          <div className="flex w-max items-stretch gap-4 pr-4 animate-[marquee_34s_linear_infinite] group-hover:[animation-play-state:paused]">
            {loopedReviews.map((review, index) => (
              <ReviewCard key={`${review.reviewerName}-${index}`} review={review} />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
