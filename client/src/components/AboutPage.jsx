import LegalPageLayout from './legal/LegalPageLayout';

const LAST_UPDATED = 'July 2, 2026';

const sections = [
  {
    id: 'why-built',
    title: 'Why the Platform Was Built',
    kicker: 'About',
    paragraphs: [
      'Companies-Wise DSA Platform was built to make interview preparation feel more structured, more trackable, and less scattered across multiple tabs and notes.',
      'The goal is to help users focus on company-specific practice while preserving progress and reducing friction in day-to-day preparation.',
    ],
  },
  {
    id: 'features',
    title: 'Features',
    kicker: 'About',
    bullets: [
      'Company-wise question browsing with searchable metadata.',
      'Progress tracking for solved questions and completion summaries.',
      'Bookmarks for quick return to questions you want to revisit.',
      'Google authentication for synced access across devices.',
    ],
  },
  {
    id: 'company-wise-preparation',
    title: 'Company-wise Preparation',
    kicker: 'About',
    paragraphs: [
      'The platform organizes questions by company so users can prepare in a way that matches how interview pipelines are often discussed and shared.',
      'This approach makes it easier to build a focused revision plan and compare preparation progress company by company.',
    ],
  },
  {
    id: 'bookmarks',
    title: 'Bookmarks',
    kicker: 'About',
    paragraphs: [
      'Bookmarks help users save questions for later review and build a personal revision queue.',
      'Saved items remain tied to the account so they can be restored whenever the user signs back in.',
    ],
  },
  {
    id: 'progress-tracking',
    title: 'Progress Tracking',
    kicker: 'About',
    paragraphs: [
      'Solved question tracking gives users a clear sense of momentum and coverage across their preparation journey.',
      'The dashboard and progress summaries are designed to encourage consistent revision rather than one-off browsing.',
    ],
  },
  {
    id: 'feedback-system',
    title: 'Feedback System',
    kicker: 'About',
    paragraphs: [
      'The feedback form exists so users can suggest improvements, flag issues, or share what would help them study more effectively.',
      'Feedback is part of the product loop and helps guide the platform’s future priorities.',
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics',
    kicker: 'About',
    paragraphs: [
      'PostHog analytics help us understand what features are useful, where users may get stuck, and how the product is performing in the real world.',
      'We use analytics to improve the experience while keeping the implementation lightweight and privacy-conscious.',
    ],
  },
  {
    id: 'source-credit',
    title: 'Source Credit',
    kicker: 'About',
    paragraphs: [
      'This platform uses a public company-wise question catalog inspired by the repository liquidslr/leetcode-company-wise-problems.',
      'We appreciate the public contribution that helped make company-focused preparation resources easier to organize and explore.',
    ],
    note: 'Repository credit: https://github.com/liquidslr/leetcode-company-wise-problems',
  },
];

export default function AboutPage() {
  return (
    <LegalPageLayout
      title="About"
      description="Learn why the Companies-Wise DSA Platform exists, what features it offers, and how it supports company-wise preparation, progress tracking, analytics, and source credit."
      updatedAt={LAST_UPDATED}
      intro="This page explains the purpose of the platform and the main features available to help with structured interview preparation."
      sections={sections}
    />
  );
}
