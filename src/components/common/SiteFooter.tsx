import Link from "next/link";
import { Heart } from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { ROUTES } from "@/constants/routes";

import type { SVGProps } from "react";

/**
 * lucide dropped its brand icons, so the three we need are inlined here. They
 * are decorative - the link text carries the accessible name.
 */
function BrandIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      {...props}
    />
  );
}

function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandIcon {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </BrandIcon>
  );
}

function GitHubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandIcon {...props}>
      <path d="M12 .5C5.73.5.6 5.63.6 11.9c0 5.02 3.26 9.28 7.78 10.78.57.1.78-.25.78-.55l-.01-2.14c-3.17.69-3.84-1.34-3.84-1.34-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.25.73-1.54-2.53-.29-5.19-1.27-5.19-5.64 0-1.25.44-2.27 1.18-3.07-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.15 1.17a10.9 10.9 0 0 1 5.74 0c2.19-1.48 3.15-1.17 3.15-1.17.62 1.57.23 2.73.11 3.02.74.8 1.18 1.82 1.18 3.07 0 4.38-2.67 5.34-5.21 5.63.41.36.78 1.06.78 2.15l-.01 3.18c0 .3.2.66.79.55a11.4 11.4 0 0 0 7.77-10.78C23.4 5.63 18.27.5 12 .5z" />
    </BrandIcon>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <BrandIcon {...props}>
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07zM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.78.3-1.44.71-2.1 1.37A5.9 5.9 0 0 0 .67 4.1c-.3.76-.5 1.64-.56 2.91C.05 8.29.04 8.7.04 11.96s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.78.71 1.44 1.37 2.1a5.9 5.9 0 0 0 2.1 1.37c.76.3 1.64.5 2.91.56 1.28.06 1.69.07 4.95.07s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.1-1.37 5.9 5.9 0 0 0 1.37-2.1c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.37-2.1A5.9 5.9 0 0 0 19.91.63c-.76-.3-1.64-.5-2.91-.56C15.72.01 15.31 0 12.05 0H12zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z" />
    </BrandIcon>
  );
}

function CoffeeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <path d="M10 2v2M14 2v2M6 2v2M18 8h1a4 4 0 0 1 0 8h-1M6 8h12v9a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8z" />
    </svg>
  );
}

const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/theangryysoul",
    Icon: LinkedInIcon,
  },
  {
    label: "GitHub",
    href: "https://github.com/theangryysoul",
    Icon: GitHubIcon,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/get.up.jerry",
    Icon: InstagramIcon,
  },
  {
    label: "Buy me a coffee",
    href: "https://buymeacoffee.com/theangryysoul",
    Icon: CoffeeIcon,
  },
];

const FOOTER_LINKS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD },
  { label: "Courses", href: ROUTES.COURSES },
  { label: "Import", href: ROUTES.IMPORT },
  { label: "Settings", href: ROUTES.SETTINGS },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/50 bg-white/30 backdrop-blur-xl dark:border-white/10 dark:bg-black/25">
      <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" aria-label="Coursify home" className="inline-flex">
              <Logo className="h-8 w-auto" sizes="104px" />
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Organise your courses, import YouTube playlists and keep learning
              without the tab chaos.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Explore
            </h2>

            <ul className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href={ROUTES.LOGIN}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  Login
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex flex-col gap-3">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Say hello
            </h2>

            <ul className="flex items-center gap-2">
              {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={label}
                    title={label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/50 text-muted-foreground transition-colors hover:border-[var(--lp-coral)]/40 hover:text-foreground dark:border-white/10 dark:bg-white/5"
                  >
                    <Icon className="h-[18px] w-[18px]" />
                  </a>
                </li>
              ))}
            </ul>

            <a
              href="https://buymeacoffee.com/theangryysoul"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-[var(--lp-coral-light)] to-[var(--lp-coral)] px-4 py-2 text-sm font-semibold text-[var(--on-accent)] shadow-lg transition-transform hover:-translate-y-0.5"
            >
              <CoffeeIcon className="h-4 w-4" />
              Buy me a coffee
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/50 pt-6 text-sm text-muted-foreground dark:border-white/10 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Coursify. All rights reserved.</p>

          <p className="flex items-center gap-1.5">
            Made with
            <Heart
              className="h-4 w-4"
              aria-label="love"
              style={{ color: "var(--lp-coral)" }}
              fill="currentColor"
            />
            by Vishal Verma
          </p>
        </div>
      </div>
    </footer>
  );
}
