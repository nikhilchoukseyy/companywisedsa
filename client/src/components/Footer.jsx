import { FiGithub, FiInstagram, FiLinkedin } from 'react-icons/fi';

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
  },
  {
    label: 'GitHub',
    href: 'https://github.com/nikhilchoukseyy',
    icon: FiGithub,
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-page/95">
  <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-4 px-8 py-4 text-sm text-text-secondary md:grid-cols-3">

    {/* Copyright */}
    <p className="text-center md:text-left">
      <span className="font-medium text-text-primary">CompanyWiseDSA</span> © 2026
    </p>

    {/* Developed By */}
    <p className="text-center">
      Developed by{" "}
      <span className="font-medium text-text-primary">
        Nikhil Chouksey
      </span>
    </p>

    {/* Social Links */}
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
</footer>
  );
}
