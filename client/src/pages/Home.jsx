import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  Activity,
  Users,
  Workflow,
  KeyRound,
  LayoutDashboard,
  ArrowRight,
  Menu,
  X,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "About", href: "#about" },
];

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Role-based access control",
    desc: "Admins, agents, and customers each see exactly what they need — nothing more, nothing less.",
  },
  {
    icon: Activity,
    title: "Real-time complaint tracking",
    desc: "Every update, comment, and status change syncs instantly across the team.",
  },
  {
    icon: Users,
    title: "Agent assignment system",
    desc: "Route cases automatically or assign by hand, based on load and expertise.",
  },
  {
    icon: Workflow,
    title: "Status workflow",
    desc: "Open, in progress, resolved — a clear path every case follows, with full audit history.",
  },
  {
    icon: KeyRound,
    title: "Secure authentication",
    desc: "JWT-based sessions keep every account and customer record protected by default.",
  },
  {
    icon: LayoutDashboard,
    title: "Admin dashboard control",
    desc: "One view of volume, response times, and team performance — no spreadsheets required.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Customer raises a complaint",
    desc: "Submitted through the portal with the details and context an agent will need.",
  },
  {
    num: "02",
    title: "Admin assigns an agent",
    desc: "Routed to the right person based on category, workload, or priority.",
  },
  {
    num: "03",
    title: "Agent resolves the issue",
    desc: "Status moves from open to resolved, with a full record kept for reference.",
  },
];

const ROLES = [
  {
    title: "Admin Dashboard",
    desc: "Oversee every case, manage agents, and monitor team performance from a single control center.",
    points: ["Team & permissions", "Case volume analytics", "SLA monitoring"],
    cta: "Preview admin view",
  },
  {
    title: "Agent Dashboard",
    desc: "A focused queue of assigned cases, with everything needed to respond and resolve quickly.",
    points: ["Assigned case queue", "Internal notes", "Status updates"],
    cta: "Preview agent view",
  },
  {
    title: "Customer Portal",
    desc: "A simple place for customers to file complaints and track resolution status in real time.",
    points: ["Submit a complaint", "Track case status", "Message history"],
    cta: "Preview customer view",
  },
];

function CaseBoardMock() {
  const cases = [
    { id: "CR-2381", title: "Delayed refund on order", status: "open" },
    { id: "CR-2380", title: "Login access issue", status: "progress" },
    { id: "CR-2376", title: "Damaged item received", status: "progress" },
    { id: "CR-2371", title: "Billing discrepancy", status: "resolved" },
  ];

  const statusMap = {
    open: {
      label: "Open",
      icon: Circle,
      classes: "text-rose-600 bg-rose-50 ring-rose-200",
    },
    progress: {
      label: "In progress",
      icon: Clock,
      classes: "text-amber-600 bg-amber-50 ring-amber-200",
    },
    resolved: {
      label: "Resolved",
      icon: CheckCircle2,
      classes: "text-emerald-600 bg-emerald-50 ring-emerald-200",
    },
  };

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
        </div>
        <span className="font-mono text-xs text-slate-400">
          case-registry/queue
        </span>
      </div>
      <div className="divide-y divide-slate-100">
        {cases.map((c) => {
          const s = statusMap[c.status];
          const Icon = s.icon;
          return (
            <div
              key={c.id}
              className="flex items-center justify-between gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-xs text-slate-400 shrink-0">
                  {c.id}
                </span>
                <span className="text-sm text-slate-700 truncate">
                  {c.title}
                </span>
              </div>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${s.classes}`}
              >
                <Icon className="h-3 w-3" strokeWidth={2.5} />
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="border-t border-slate-100 bg-slate-50/60 px-5 py-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>4 active cases</span>
          <span className="font-mono">avg. resolution: 6h 12m</span>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* ───────────────────────── Navbar ───────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <ShieldCheck className="h-4.5 w-4.5" strokeWidth={2.25} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-slate-900">
              Customer Registry
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-slate-800"
            >
              Get Started
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded-md p-2 text-slate-600 md:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </nav>

        {mobileOpen && (
          <div className="border-t border-slate-200 bg-white px-6 py-4 md:hidden">
            <div className="flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  {link.label}
                </a>
              ))}
              <div className="mt-2 flex flex-col gap-3 border-t border-slate-100 pt-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-100 via-indigo-50 to-transparent opacity-70 blur-3xl" />
          <div className="absolute right-[-10%] top-[20%] h-[400px] w-[400px] rounded-full bg-gradient-to-br from-sky-100 to-transparent opacity-60 blur-3xl" />
          <svg
            className="absolute inset-0 h-full w-full opacity-[0.4]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M48 0H0V48"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:px-8 lg:pb-28 lg:pt-24">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-12">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Built for support &amp; operations teams
              </div>

              <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.1]">
                Streamline complaint &amp; case management for modern teams
              </h1>

              <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
                One system for the whole loop — customers submit cases, admins
                assign them, and agents resolve them. Clear roles, clear status,
                no spreadsheets in between.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white shadow-sm shadow-indigo-600/20 transition-colors hover:bg-indigo-500"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  Login
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-8 border-t border-slate-100 pt-8 text-sm text-slate-500">
                <div>
                  <span className="font-mono text-base font-semibold text-slate-900">
                    3
                  </span>
                  <span className="ml-1.5">role-based portals</span>
                </div>
                <div>
                  <span className="font-mono text-base font-semibold text-slate-900">
                    JWT
                  </span>
                  <span className="ml-1.5">secured sessions</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <CaseBoardMock />
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Features ───────────────────────── */}
      <section
        id="features"
        className="border-t border-slate-100 bg-slate-50/60 py-20 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-medium text-indigo-600">
              Features
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Everything the case lifecycle needs
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              From intake to resolution, each piece is built so admins, agents,
              and customers stay in sync without extra tools.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="group rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                  <Icon className="h-5 w-5" strokeWidth={2} />
                </div>
                <h3 className="text-base font-semibold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── How it works ───────────────────────── */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-medium text-indigo-600">
              How it works
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              From complaint to resolution, in three steps
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
            {STEPS.map((step, i) => (
              <div key={step.num} className="relative">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-slate-400">
                    {step.num}
                  </span>
                  <div className="h-px flex-1 bg-slate-200" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {step.desc}
                </p>
                {i < STEPS.length - 1 && (
                  <ArrowRight className="absolute -right-7 top-1 hidden h-4 w-4 text-slate-300 md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── Role Preview ───────────────────────── */}
      <section
        id="roles"
        className="border-t border-slate-100 bg-slate-50/60 py-20 lg:py-28"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-sm font-medium text-indigo-600">
              Built for every role
            </span>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              A dedicated view for everyone in the loop
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {ROLES.map((role) => (
              <div
                key={role.title}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {role.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {role.desc}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {role.points.map((p) => (
                    <li
                      key={p}
                      className="flex items-center gap-2.5 text-sm text-slate-600"
                    >
                      <CheckCircle2
                        className="h-4 w-4 shrink-0 text-emerald-500"
                        strokeWidth={2}
                      />
                      {p}
                    </li>
                  ))}
                </ul>

                <button className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-900 hover:bg-slate-900 hover:text-white">
                  {role.cta}
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA banner ───────────────────────── */}
      <section className="py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-slate-900 px-8 py-14 text-center sm:px-16">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
            >
              <div className="absolute left-1/2 top-1/2 h-[400px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-3xl" />
            </div>
            <h2 className="relative text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Bring order to your complaint workflow
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-300">
              Set up admin, agent, and customer access in minutes — no
              infrastructure to manage.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-100"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-slate-800"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Footer ───────────────────────── */}
      <footer id="about" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
                  <ShieldCheck className="h-4 w-4" strokeWidth={2.25} />
                </span>
                <span className="text-[15px] font-semibold tracking-tight text-slate-900">
                  Customer Registry
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                A registry for customer complaints and cases — built for admins,
                agents, and the customers they support.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Product
                </h4>
                <ul className="mt-3 space-y-2.5 text-sm text-slate-500">
                  <li>
                    <a href="#features" className="hover:text-slate-900">
                      Features
                    </a>
                  </li>
                  <li>
                    <a href="#pricing" className="hover:text-slate-900">
                      Pricing
                    </a>
                  </li>
                  <li>
                    <a href="#roles" className="hover:text-slate-900">
                      Roles
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  Company
                </h4>
                <ul className="mt-3 space-y-2.5 text-sm text-slate-500">
                  <li>
                    <a href="#about" className="hover:text-slate-900">
                      About
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-slate-900">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Legal</h4>
                <ul className="mt-3 space-y-2.5 text-sm text-slate-500">
                  <li>
                    <a href="#" className="hover:text-slate-900">
                      Privacy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-slate-900">
                      Terms
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {new Date().getFullYear()} Customer Registry. All rights
              reserved.
            </span>
            <span className="font-mono">Status: all systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
