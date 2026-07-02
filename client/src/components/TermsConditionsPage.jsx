import LegalPageLayout from './legal/LegalPageLayout';

const LAST_UPDATED = 'July 2, 2026';

const sections = [
  {
    id: 'purpose-of-the-platform',
    title: 'Purpose of the Platform',
    kicker: 'Terms & Conditions',
    paragraphs: [
      'The Companies-Wise DSA Platform is built to help users practice data structures and algorithms with a company-focused learning path.',
      'The site is intended to support self-study, preparation planning, and progress tracking for educational purposes.',
    ],
  },
  {
    id: 'educational-use-only',
    title: 'Educational Use Only',
    kicker: 'Terms & Conditions',
    paragraphs: [
      'All content on this platform is provided for educational and informational use.',
      'Nothing on the website should be treated as professional career, legal, financial, or employment advice.',
    ],
  },
  {
    id: 'user-responsibilities',
    title: 'User Responsibilities',
    kicker: 'Terms & Conditions',
    paragraphs: [
      'You agree to use the platform lawfully, respectfully, and in a way that does not interfere with the experience of other users or the operation of the service.',
    ],
    bullets: [
      'Provide accurate account information when signing in.',
      'Do not attempt to access protected resources without authorization.',
      'Do not misuse the platform, scrape data in a harmful way, or interfere with normal service operation.',
      'Respect intellectual property rights and external service terms.',
    ],
  },
  {
    id: 'account-usage',
    title: 'Account Usage',
    kicker: 'Terms & Conditions',
    paragraphs: [
      'When you sign in using Google Authentication, your account is tied to the identity information returned by that provider.',
      'You are responsible for maintaining the security of your account and for all activity associated with it.',
    ],
  },
  {
    id: 'no-interview-guarantee',
    title: 'No Interview Guarantee',
    kicker: 'Terms & Conditions',
    paragraphs: [
      'Using this platform does not guarantee interview invitations, interview success, or any particular outcome in your job search.',
      'Preparation quality, hiring decisions, and interview experiences depend on many factors outside this website.',
    ],
  },
  {
    id: 'no-placement-guarantee',
    title: 'No Placement Guarantee',
    kicker: 'Terms & Conditions',
    paragraphs: [
      'The platform does not guarantee placements, offers, promotions, or any other employment result.',
      'The website is a study aid, not a substitute for broad technical preparation and professional judgment.',
    ],
  },
  {
    id: 'external-links',
    title: 'External Links',
    kicker: 'Terms & Conditions',
    paragraphs: [
      'The platform may link to third-party websites such as the official LeetCode website, Google services, or external resources.',
      'We are not responsible for the content, availability, policies, or security practices of those external websites.',
    ],
  },
  {
    id: 'intellectual-property',
    title: 'Intellectual Property',
    kicker: 'Terms & Conditions',
    paragraphs: [
      'The website layout, brand presentation, and original platform materials are owned by the site operator unless otherwise noted.',
      'Company names, trademarks, logos, and problem references belong to their respective owners and are used for identification and educational organization only.',
    ],
  },
  {
    id: 'termination',
    title: 'Termination',
    kicker: 'Terms & Conditions',
    paragraphs: [
      'We may suspend or terminate access to the platform if we believe the service is being misused, abused, or accessed in a way that harms the system or other users.',
      'Where reasonable, we may review issues before taking action, but we reserve the right to protect the service and its users.',
    ],
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability',
    kicker: 'Terms & Conditions',
    paragraphs: [
      'To the fullest extent permitted by law, the platform is provided on an "as is" and "as available" basis.',
      'We are not liable for indirect, incidental, special, consequential, or punitive damages arising from your use of the site or any external service linked from it.',
    ],
  },
  {
    id: 'changes-to-terms',
    title: 'Changes to Terms',
    kicker: 'Terms & Conditions',
    paragraphs: [
      'We may update these Terms & Conditions from time to time to reflect product changes, legal requirements, or operational updates.',
      'When changes are made, we will update the last updated date and publish the revised terms on this page.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact',
    kicker: 'Terms & Conditions',
    paragraphs: [
      'If you have questions about these terms, contact the platform operator through the website feedback or support channels.',
    ],
  },
];

export default function TermsConditionsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      description="Review the terms that govern use of the Companies-Wise DSA Platform, including educational use, user responsibilities, external links, limitations, and platform ownership."
      updatedAt={LAST_UPDATED}
      intro="These terms explain how the platform should be used and set expectations for educational access, account usage, and liability."
      sections={sections}
    />
  );
}
