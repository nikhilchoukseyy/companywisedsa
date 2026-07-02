import LegalPageLayout from './legal/LegalPageLayout';

const LAST_UPDATED = 'July 2, 2026';

const sections = [
  {
    id: 'introduction',
    title: 'Introduction',
    kicker: 'Privacy Policy',
    paragraphs: [
      'This Privacy Policy explains how the Companies-Wise DSA Platform collects, uses, stores, and protects information when you use the website and related services.',
      'The platform is designed for educational preparation and keeps data collection limited to what is needed to operate user accounts, preserve learning progress, and improve the product experience.',
    ],
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    kicker: 'Privacy Policy',
    paragraphs: [
      'We collect information that you provide directly, information created through normal platform usage, and limited technical data required to keep the service secure and reliable.',
    ],
    bullets: [
      'Account details such as name, email address, profile picture, and Google authentication identifiers.',
      'User preferences such as the last company viewed, selected file range, search filters, and pagination settings.',
      'Saved activity such as bookmarked questions, solved questions, and related timestamps.',
      'Analytics and device data collected through PostHog, including page views, interactions, session information, and browser-level technical signals.',
    ],
  },
  {
    id: 'google-authentication',
    title: 'Google Authentication',
    kicker: 'Privacy Policy',
    paragraphs: [
      'If you sign in with Google, we receive basic profile information from the Google authentication flow so we can create or access your account.',
      'We use the returned account information to identify your profile, keep your progress synced, and avoid overwriting an existing role or account state.',
    ],
  },
  {
    id: 'user-preferences',
    title: 'User Preferences',
    kicker: 'Privacy Policy',
    paragraphs: [
      'User preferences help the platform remember your browsing state and reduce repetitive setup when you return to the site.',
      'Preferences may include your last company, last file range, difficulty filters, search text, page size, and other settings that improve continuity across sessions.',
    ],
  },
  {
    id: 'bookmarks',
    title: 'Bookmarks',
    kicker: 'Privacy Policy',
    paragraphs: [
      'Bookmarks are stored so you can revisit questions you want to review later.',
      'We retain bookmarked question identifiers and timestamps linked to your account so the saved list can be restored across devices.',
    ],
  },
  {
    id: 'solved-questions',
    title: 'Solved Questions',
    kicker: 'Privacy Policy',
    paragraphs: [
      'We store solved question identifiers and related activity so you can track your preparation progress over time.',
      'Solved history is used to render dashboards, completion metrics, and recent progress summaries.',
    ],
  },
  {
    id: 'analytics-posthog',
    title: 'Analytics (PostHog)',
    kicker: 'Privacy Policy',
    paragraphs: [
      'The platform uses PostHog Analytics to understand how the product is used, measure feature adoption, and diagnose usability issues.',
      'PostHog may collect page views, session replay data, click events, performance-related metadata, and anonymous browser signals configured through the website.',
    ],
    note:
      'Analytics are used for product improvement and troubleshooting. We do not sell your usage data.',
  },
  {
    id: 'cookies',
    title: 'Cookies',
    kicker: 'Privacy Policy',
    paragraphs: [
      'Cookies are used to keep you signed in, preserve preferences, and support the normal operation of the site.',
      'We may also use cookies and similar storage methods to support authentication, replay, and analytics functionality provided by the platform and its service providers.',
    ],
  },
  {
    id: 'third-party-services',
    title: 'Third-party Services',
    kicker: 'Privacy Policy',
    paragraphs: [
      'The platform depends on a small set of third-party services to function properly.',
    ],
    bullets: [
      'Google Authentication for sign-in and account identity.',
      'PostHog Analytics for product analytics, session replay, heatmaps, and feature flags.',
      'MongoDB for secure application data storage.',
      'Publicly available company-wise question metadata used to organize preparation content.',
    ],
  },
  {
    id: 'data-storage',
    title: 'Data Storage',
    kicker: 'Privacy Policy',
    paragraphs: [
      'User account data, preferences, bookmarks, solved progress, and related application records are stored in MongoDB.',
      'We keep data only for as long as needed to provide the service, maintain your account, and satisfy legitimate operational or legal requirements.',
    ],
  },
  {
    id: 'data-security',
    title: 'Data Security',
    kicker: 'Privacy Policy',
    paragraphs: [
      'We use reasonable administrative and technical safeguards to protect the application and the information processed through it.',
      'No system can be guaranteed to be completely secure, but we work to limit access, minimize collection, and keep sensitive configuration out of the client bundle.',
    ],
  },
  {
    id: 'data-deletion',
    title: 'Data Deletion',
    kicker: 'Privacy Policy',
    paragraphs: [
      'If you want your account or data reviewed for deletion, contact us using the details below.',
      'We will review deletion requests in good faith and remove or anonymize data where appropriate and technically feasible, subject to legal or operational requirements.',
    ],
  },
  {
    id: 'childrens-privacy',
    title: "Children's Privacy",
    kicker: 'Privacy Policy',
    paragraphs: [
      'This platform is intended for users who are preparing for technical interviews and is not directed to young children.',
      'We do not knowingly collect personal information from children, and if we become aware that such information was collected, we will take reasonable steps to delete it.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact Information',
    kicker: 'Privacy Policy',
    paragraphs: [
      'If you have privacy questions, data requests, or concerns about how information is handled, contact the site owner or administrator through the feedback channels on the platform.',
      'We will review legitimate requests and respond as soon as reasonably possible.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      description="Learn how the Companies-Wise DSA Platform collects, uses, stores, and protects user information, including Google authentication, PostHog analytics, MongoDB storage, and saved progress."
      updatedAt={LAST_UPDATED}
      intro="This policy explains the information we collect and how we use it to operate the platform, preserve your progress, and improve the experience."
      sections={sections}
    />
  );
}
