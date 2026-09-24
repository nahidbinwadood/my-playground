import Link from 'next/link';
import Wordmark from '../common/wordmark';

// Only routes that exist. A footer full of `#` links is worse than a short one.
const REPO_URL = 'https://github.com/nahidbinwadood/my-playground';

const footerColumns = [
  {
    heading: 'Playground',
    links: [
      { name: 'Components', href: '/components' },
      { name: 'Form challenges', href: '/form-playground' },
      { name: 'Blog', href: '/blogs' },
    ],
  },
  {
    heading: 'Elsewhere',
    links: [
      { name: 'Source on GitHub', href: REPO_URL, external: true },
      { name: 'Sign in', href: '/auth/login' },
    ],
  },
];

const stack = ['Next.js 16', 'TypeScript', 'Tailwind 4'];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 py-14 sm:py-16 md:grid-cols-12 md:gap-8">
          {/* Identity */}
          <div className="md:col-span-4 lg:col-span-5">
            <Link
              href="/"
              className="inline-flex items-center rounded-md"
            >
              <Wordmark />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Live React components and form-validation experiments. Every
              example here runs in the browser — nothing is a screenshot.
            </p>
          </div>

          {/* Link columns */}
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-9 md:col-span-8 lg:col-span-7"
          >
            {footerColumns.map((column) => (
              <div key={column.heading}>
                <h3 className="eyebrow">{column.heading}</h3>
                <ul role="list" className="mt-3 space-y-0.5">
                  {column.links.map((item) => (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        {...('external' in item && item.external
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                        className="inline-block rounded-sm py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom bar — the stack list and the year are machine values, so this
            is the one place in the footer that stays mono. */}
        <div className="flex flex-col gap-2 border-t border-line py-6 font-mono text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="tracking-tight">{stack.join(' · ')}</p>
          <p className="tabular-nums tracking-tight">
            &copy; {new Date().getFullYear()} playground
          </p>
        </div>
      </div>
    </footer>
  );
}
