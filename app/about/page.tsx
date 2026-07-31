import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import {
  Mail, Phone, MapPin, Newspaper, Target, BookOpen,
  Users, Feather, Trophy, Globe, ArrowRight, Star,
  Facebook, Twitter, Instagram, Youtube,
} from "lucide-react";
import type { SiteConfig } from "@/lib/site-config";
import { DEFAULT_SITE_CONFIG } from "@/lib/site-config";

export const metadata = {
  title: "About — The Beacon",
  description:
    "Learn about The Beacon, Harrow Hill High School's official student publication — our history, mission, and the team behind the stories.",
};

async function fetchSiteConfig(): Promise<SiteConfig> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/settings/public`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return DEFAULT_SITE_CONFIG;
    const data = await res.json();
    return { ...DEFAULT_SITE_CONFIG, ...data.settings };
  } catch {
    return DEFAULT_SITE_CONFIG;
  }
}

// ─── Section data ─────────────────────────────────────────────────────────────

const SECTIONS = [
  { icon: Newspaper,  label: "News",     color: "bg-blue-100 text-blue-700",     href: "/news",     desc: "Breaking stories and campus updates." },
  { icon: Feather,    label: "Features", color: "bg-purple-100 text-purple-700", href: "/features", desc: "In-depth reporting and human interest." },
  { icon: Trophy,     label: "Sports",   color: "bg-green-100 text-green-700",   href: "/sports",   desc: "Championships, profiles, and field coverage." },
  { icon: BookOpen,   label: "Literary", color: "bg-amber-100 text-amber-700",   href: "/literary", desc: "Poetry, fiction, and personal essays." },
  { icon: Globe,      label: "Filipino", color: "bg-red-100 text-red-700",       href: "/filipino", desc: "Mga kuwento at sanaysay sa Filipino." },
  { icon: Star,       label: "Opinions", color: "bg-slate-100 text-slate-700",   href: "/opinions", desc: "Editorials and staff perspectives." },
];

const MILESTONES = [
  { year: "1985", label: "Founded",     detail: "The Beacon was established as the official student publication of Harrow Hill High School, giving student journalists their first formal home." },
  { year: "1980s", label: "Growth",      detail: "Coverage expanded beyond school events to broader community stories, and the paper began entering regional press conferences." },
  { year: "1990s", label: "Competitions",detail: "Student writers earned recognition in national press competitions, cementing the paper's reputation for quality campus journalism." },
  { year: "2000s", label: "Digital Era", detail: "The Beacon embraced digital tools for layout and photography, modernizing production while maintaining its print-quality standards." },
  { year: "2020s", label: "Online",      detail: "Full transition to a web-first publication, making stories instantly available to the entire school community and beyond." },
];

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-4xl font-bold text-white">{value}</p>
      <p className="text-white/70 text-sm mt-1">{label}</p>
    </div>
  );
}

function TikTokIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.9a8.22 8.22 0 004.8 1.53V7a4.85 4.85 0 01-1.03-.31z" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AboutPage() {
  const config = await fetchSiteConfig();

  const socialLinks = [
    { url: config.facebook,  Icon: Facebook,  label: "Facebook"  },
    { url: config.twitter,   Icon: Twitter,   label: "Twitter"   },
    { url: config.instagram, Icon: Instagram, label: "Instagram" },
    { url: config.youtube,   Icon: Youtube,   label: "YouTube"   },
    { url: config.tiktok,    Icon: null,      label: "TikTok"    },
  ].filter((s) => s.url);

  return (
    <PageLayout>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-gray-900 via-red-950 to-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-400 mb-4">
            <span className="w-8 h-px bg-red-400" />
            {config.school}
            <span className="w-8 h-px bg-red-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight mb-5">
            {config.name}
          </h1>
          <p className="text-lg sm:text-xl text-white/70 leading-relaxed max-w-2xl mx-auto">
            {config.description}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link
              href="/editorial-board"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-semibold transition-colors"
            >
              <Users size={15} /> Meet the Team
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-semibold transition-colors"
            >
              <Newspaper size={15} /> Read Stories
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <div className="bg-red-600 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <StatCard value="50+" label="Years of journalism" />
            <StatCard value="6"   label="Editorial sections" />
            <StatCard value="100+" label="Stories published" />
            <StatCard value="1"   label="School community" />
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* ── Mission ──────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Mission</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{config.mission}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Vision</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{config.vision}</p>
            </div>
          </div>

          <div className="mt-6 bg-red-50 border border-red-100 rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Core Values</h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: "Accuracy",    desc: "We verify before we publish. Every fact matters." },
                { label: "Fairness",    desc: "We represent all sides of every story, without bias." },
                { label: "Courage",     desc: "We report difficult truths when our community needs them." },
                { label: "Inclusivity", desc: "We amplify student voices from every part of campus life." },
                { label: "Excellence",  desc: "We hold our writing and editing to a high standard." },
                { label: "Service",     desc: "We exist for the community, not for the byline." },
              ].map((v) => (
                <div key={v.label} className="flex gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{v.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── History ──────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Our History</h2>
          </div>
          <p className="text-gray-600 leading-relaxed mb-8">
            For more than five decades, {config.name} has chronicled the life of {config.school} —
            its achievements, its challenges, and the students who shape its story. What started as
            a modest school paper has grown into a full-service student publication with multiple
            sections, a digital presence, and a proud record of press conference recognition.
          </p>
          <div className="relative">
            <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-gray-200 hidden sm:block" />
            <div className="space-y-6">
              {MILESTONES.map((m) => (
                <div key={m.year} className="flex gap-6">
                  <div className="shrink-0 w-20 text-right sm:block hidden">
                    <span className="text-sm font-bold text-red-600">{m.year}</span>
                  </div>
                  <div className="relative flex-1 bg-white border border-gray-200 rounded-xl p-5">
                    <div className="absolute -left-2.5 top-5 w-5 h-5 rounded-full bg-red-600 border-2 border-white shadow-sm hidden sm:block" />
                    <div className="flex items-center gap-2 mb-1">
                      <span className="sm:hidden text-xs font-bold text-red-600">{m.year} · </span>
                      <p className="font-semibold text-gray-900 text-sm">{m.label}</p>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{m.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Sections ─────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Newspaper size={20} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">What We Cover</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.label}
                  href={s.href}
                  className="group flex gap-4 bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md hover:border-gray-300 transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}>
                    <Icon size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-red-600 transition-colors">{s.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                  <ArrowRight size={15} className="text-gray-300 group-hover:text-red-400 shrink-0 self-center transition-colors" />
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Mail size={20} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-900">Get in Touch</h3>
              <div className="space-y-3">
                {config.email && (
                  <a
                    href={`mailto:${config.email}`}
                    className="flex items-center gap-3 text-sm text-gray-600 hover:text-red-600 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-red-50 group-hover:bg-red-100 rounded-lg flex items-center justify-center transition-colors shrink-0">
                      <Mail size={15} className="text-red-600" />
                    </div>
                    {config.email}
                  </a>
                )}
                {config.phone && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                      <Phone size={15} className="text-gray-500" />
                    </div>
                    {config.phone}
                  </div>
                )}
                {config.address && (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center shrink-0">
                      <MapPin size={15} className="text-gray-500" />
                    </div>
                    {config.address}
                  </div>
                )}
                {socialLinks.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Follow Us</p>
                    <div className="flex gap-2">
                      {socialLinks.map(({ url, Icon, label }) => (
                        <a
                          key={label}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={label}
                          className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center text-white transition-colors"
                        >
                          {Icon ? <Icon size={15} /> : <TikTokIcon size={15} />}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Story Tips & Pitches</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                Have a story idea, a campus issue that needs coverage, or a correction to report?
                Our editorial team wants to hear from you.
              </p>
              <a
                href={`mailto:${config.email}?subject=Story Tip`}
                className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Send a tip <ArrowRight size={14} />
              </a>

              <hr className="my-4 border-gray-100" />

              <h3 className="font-semibold text-gray-900 mb-2">Press & Media</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">
                For media inquiries, republication requests, or press credentials for school events,
                contact our managing editor directly.
              </p>
              <a
                href={`mailto:${config.email}?subject=Press Inquiry`}
                className="inline-flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
              >
                Media inquiry <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* ── Join Us CTA ───────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 py-14 mt-4">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Join {config.name}</h2>
          <p className="text-white/80 leading-relaxed mb-7 max-w-xl mx-auto">
            We're always looking for passionate student writers, photographers, layout artists,
            and editors. No experience required — just curiosity and a desire to tell stories.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`mailto:${config.email}?subject=I want to join ${config.name}`}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-red-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              <Mail size={16} /> Apply Now
            </a>
            <Link
              href="/editorial-board"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/15 hover:bg-white/25 rounded-lg font-semibold transition-colors"
            >
              <Users size={16} /> Meet the Team
            </Link>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
