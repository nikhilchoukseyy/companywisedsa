import { FiInstagram, FiLinkedin ,FiGithub} from 'react-icons/fi';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms & Conditions', to: '/terms-and-conditions' },
];

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/nikhilchoukseyy',
    icon: FiLinkedin,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/nikhilchoukseyy',
    icon: FiInstagram,
  }, {
    label: 'GitHub',
    href: 'https://github.com/nikhilchoukseyy',
    icon: FiGithub,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-page/95">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-4 px-4 py-5 text-sm text-text-secondary sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center md:text-left">
            <span className="font-medium text-text-primary">CompanyWiseDSA</span> © 2026
          </p>

          <p className="text-center">
            Developed by <span className="font-medium text-text-primary">Nikhil Chouksey</span>
          </p>

          <div className="flex justify-center gap-3 md:justify-end">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-text-secondary transition-colors hover:border-brand hover:bg-brand/10 hover:text-brand"
              >
                <Icon size={17} />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-text-secondary">
          {NAV_LINKS.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className="inline-flex items-center rounded-full border border-border bg-surface px-3 py-2 transition-colors hover:border-brand hover:bg-brand/10 hover:text-brand"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
