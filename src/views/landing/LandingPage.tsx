import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Bookmark,
  ChartNoAxesCombined,
  Check,
  CirclePlay,
  Clock3,
  Flame,
  FolderHeart,
  GraduationCap,
  LayoutDashboard,
  Library,
  Play,
  Settings,
  Sparkles,
  User,
} from "lucide-react";

import { Logo } from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { PageEffects } from "@/components/common/PageEffects";
import { ROUTES } from "@/constants/routes";

import "./landing.css";

const features = [
  {
    icon: Play,
    title: "YouTube Learning",
    text: "Organise your YouTube playlists and videos into one learning library.",
    color: "peach",
  },
  {
    icon: Bookmark,
    title: "Resume Learning",
    text: "Continue exactly where you left off with saved learning progress.",
    color: "lilac",
  },
  {
    icon: ChartNoAxesCombined,
    title: "Track Progress",
    text: "Monitor your learning statistics, streaks and completed lessons.",
    color: "mint",
  },
  {
    icon: FolderHeart,
    title: "Smart Folders",
    text: "Organise your courses into personalised folders and collections.",
    color: "butter",
  },
];

const steps = [
  {
    number: "01",
    title: "Import your courses",
    text: "Add a YouTube playlist or individual video.",
  },
  {
    number: "02",
    title: "Learn at your pace",
    text: "Watch lessons and automatically keep track of progress.",
  },
  {
    number: "03",
    title: "Track your growth",
    text: "Build consistency through learning statistics and streaks.",
  },
];

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Library, label: "Courses" },
  { icon: CirclePlay, label: "Import" },
  { icon: User, label: "Profile" },
  { icon: Settings, label: "Settings" },
];

const statCards = [
  { icon: Library, label: "Courses", value: "43", color: "peach" },
  { icon: CirclePlay, label: "Videos Completed", value: "0", color: "lilac" },
  { icon: Clock3, label: "Watch Time", value: "0h 0m", color: "mint" },
  { icon: Flame, label: "Streak", value: "0 🔥", color: "butter" },
];

const months = [
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
];

const weekdays = ["Mon", "Wed", "Fri", "Sun"];

// A deterministic hash keeps the mock identical on every render, so the
// showcase never flickers between page loads the way Math.random() would.
const activityLevel = (index: number) => {
  let seed = ((index + 1) * 2654435761) % 4294967296;

  seed ^= seed >>> 13;
  seed = (seed * 1274126177) % 4294967296;
  seed ^= seed >>> 16;

  const bucket = seed % 100;

  if (bucket > 88) return 4;
  if (bucket > 78) return 3;
  if (bucket > 62) return 2;
  if (bucket > 40) return 1;

  return 0;
};

/**
 * A miniature of the real dashboard, used as the landing page showcase.
 * It follows the active theme, exactly like the app it is portraying.
 */
function DashboardShowcase() {
  // 48 weeks x 7 days - the same shape as the real contribution graph.
  const totalCells = 48 * 7;

  return (
    <div className="lp-showcase">
      <aside className="lp-showcase-side">
        <div className="lp-showcase-brand">
          <Logo className="h-6 w-auto" sizes="80px" />
        </div>

        <nav>
          {sidebarItems.map(({ icon: ItemIcon, label, active }) => (
            <span key={label} className={active ? "active" : undefined}>
              <ItemIcon size={14} />
              {label}
            </span>
          ))}
        </nav>
      </aside>

      <div className="lp-showcase-main">
        <div className="lp-showcase-top">
          <span className="lp-showcase-theme" aria-hidden="true">
            <span className="lp-showcase-theme-dark">Dark</span>
            <span className="lp-showcase-theme-light">Light</span>
          </span>

          <span className="lp-avatar">A</span>
        </div>

        <div className="lp-showcase-hello">
          <span className="lp-avatar lp-avatar-lg">A</span>

          <div className="lp-showcase-hello-text">
            <h3>
              Good Afternoon, ADMIN <span>👋</span>
            </h3>
            <p>Ready to continue your learning journey?</p>

            <div className="lp-pills">
              <span>
                <Library size={11} /> 43 Courses
              </span>
              <span>
                <Flame size={11} /> 0 Day Streak
              </span>
              <span>
                <Clock3 size={11} /> 0h 0m
              </span>
            </div>
          </div>

          <span className="lp-showcase-cta">+ Import Course</span>
        </div>

        <div className="lp-showcase-stats">
          {statCards.map(({ icon: StatIcon, label, value, color }) => (
            <div key={label} className={`lp-stat lp-${color}`}>
              <span className="lp-stat-icon">
                <StatIcon size={14} />
              </span>

              <small>{label}</small>
              <b>{value}</b>
            </div>
          ))}
        </div>

        <div className="lp-showcase-activity">
          <div className="lp-activity-head">
            <h4>Study Activity</h4>
            <small>Last 365 days</small>
          </div>

          <div className="lp-activity-months">
            {months.map((month) => (
              <span key={month}>{month}</span>
            ))}
          </div>

          <div className="lp-activity-body">
            <div className="lp-activity-days">
              {weekdays.map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="lp-activity-grid">
              {Array.from({ length: totalCells }, (_, index) => (
                <i
                  key={index}
                  data-level={activityLevel(index)}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          <div className="lp-activity-legend">
            <span>Less</span>
            <i data-level={0} />
            <i data-level={1} />
            <i data-level={2} />
            <i data-level={3} />
            <i data-level={4} />
            <span>More</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <PageEffects className="coursify-landing" reveal>
      <div className="lp-orb lp-orb-one" aria-hidden="true" />
      <div className="lp-orb lp-orb-two" aria-hidden="true" />
      <div className="lp-orb lp-orb-three" aria-hidden="true" />

      {/* Navbar */}
      <header className="lp-navbar">
        <Link href="/" className="lp-logo" aria-label="Coursify home">
          <Logo className="h-8 w-auto" sizes="104px" />
        </Link>

        <nav aria-label="Landing page">
          <a href="#features">Features</a>
          <a href="#how">How it works</a>
          <a href="#about">Our philosophy</a>
        </nav>

        <div className="lp-nav-buttons">
          <ThemeToggle />

          <Link href={ROUTES.LOGIN} className="lp-nav-cta">
            Get Started <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="lp-hero">
        <div className="lp-hero-text">
          <div className="lp-tag">
            <Sparkles size={14} />
            YOUR LEARNING, A LITTLE MORE YOU
          </div>

          <h1 className="lp-hero-heading">
            Make room for
            <br />
            your <em>curiosity.</em>
          </h1>

          <p>
            All those YouTube lessons you mean to watch? Give them a home.
            Coursify turns scattered videos into a learning space that keeps you
            organised, on track, and coming back for more.
          </p>

          <div className="lp-hero-buttons">
            <Link href={ROUTES.LOGIN} className="lp-main-button">
              Start Learning <ArrowRight size={17} />
            </Link>

            <a href="#how" className="lp-watch">
              <span className="lp-watch-icon">
                <Play size={12} fill="currentColor" />
              </span>
              Explore Coursify
            </a>
          </div>

          <p className="lp-proof">A calmer way to keep learning.</p>
        </div>

        <div className="lp-hero-visual lp-enter">
          <DashboardShowcase />
        </div>

        <a href="#about" className="lp-scroll">
          SCROLL TO EXPLORE <ArrowDown size={14} />
        </a>
      </section>

      {/* Philosophy */}
      <section id="about" className="lp-philosophy lp-reveal">
        <div className="lp-philosophy-icon">
          <GraduationCap size={22} />
        </div>

        <small>A SMALL REMINDER</small>

        <h2>
          The best learning journey isn&apos;t the one you start.
          <em> It&apos;s the one you keep coming back to.</em>
        </h2>

        <p>Coursify is your little nudge to make that happen.</p>
      </section>

      {/* Features */}
      <section id="features" className="lp-section">
        <div className="lp-section-heading lp-reveal">
          <small>A SPACE THAT GETS YOU</small>
          <h2>
            Less tab chaos.
            <br />
            <em>More momentum.</em>
          </h2>
          <p>
            Your videos, progress and learning rhythm, together in one
            thoughtful space.
          </p>
        </div>

        <div className="lp-feature-grid">
          {features.map(({ icon: Icon, title, text, color }, index) => (
            <article
              key={title}
              className={`lp-feature lp-${color} lp-reveal`}
              style={{ transitionDelay: `${index * 60}ms` }}
            >
              <div className="lp-feature-icon">
                <Icon size={22} />
              </div>

              <small>0{index + 1}</small>

              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="lp-how">
        <div className="lp-section-heading lp-reveal">
          <small>THREE LITTLE STEPS</small>
          <h2>
            From someday
            <br />
            to <em>done today.</em>
          </h2>
          <p>No complicated setup. Just a better place to learn.</p>
        </div>

        <div className="lp-steps">
          {steps.map(({ number, title, text }) => (
            <div className="lp-step lp-reveal" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="lp-final lp-reveal">
        <small>YOUR NEXT CHAPTER STARTS HERE</small>

        <h2>
          Curiosity called.
          <br />
          <em>Give it a place to grow.</em>
        </h2>

        <p>Build your library. Find your rhythm. Keep becoming.</p>

        <Link href={ROUTES.LOGIN} className="lp-main-button">
          Make it yours <ArrowRight size={17} />
        </Link>

        <div className="lp-final-note">
          <Check size={14} /> A simple space for your next big thing.
        </div>
      </section>
    </PageEffects>
  );
}
