import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import {
  Home, Newspaper, Feather, Trophy, BookOpen, Globe, Star,
  CalendarDays, Users, Info, FileText, Shield, Map, Accessibility,
  Send, Archive,
} from "lucide-react";

export const metadata = {
  title: "Sitemap — The Beacon",
  description: "A complete map of all pages and sections on The Beacon website.",
};

type SitemapGroup = {
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  links: { label: string; href: string; description?: string }[];
};

const GROUPS: SitemapGroup[] = [
  {
    title: "Main",
    icon: Home,
    links: [
      { label: "Home", href: "/", description: "Latest news, features, and highlights" },
      { label: "Events", href: "/events", description: "School and community events calendar" },
      { label: "Search", href: "/search", description: "Search articles and content" },
    ],
  },
  {
    title: "Sections",
    icon: Newspaper,
    links: [
      { label: "News",     href: "/news",     description: "Campus and community news" },
      { label: "Features", href: "/features", description: "In-depth reporting and human interest" },
      { label: "Sports",   href: "/sports",   description: "Athletics coverage and profiles" },
      { label: "Literary", href: "/literary", description: "Poetry, fiction, and personal essays" },
      { label: "Filipino", href: "/filipino", description: "Mga kuwento at sanaysay sa Filipino" },
      { label: "Opinions", href: "/opinions", description: "Editorials and staff perspectives" },
    ],
  },
  {
    title: "About the Publication",
    icon: Info,
    links: [
      { label: "About The Beacon", href: "/about", description: "Our history, mission, and vision" },
      { label: "Editorial Board", href: "/editorial-board", description: "Meet our current staff" },
      { label: "Submit a Story", href: "/submit", description: "How to pitch news tips and contributions" },
    ],
  },
  {
    title: "Legal & Policies",
    icon: Shield,
    links: [
      { label: "Privacy Policy",   href: "/privacy-policy",  description: "How we handle your data" },
      { label: "Terms of Service", href: "/terms",           description: "Rules for using this site" },
      { label: "Accessibility",    href: "/accessibility",   description: "Our accessibility commitment" },
      { label: "Sitemap",          href: "/sitemap",         description: "This page" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-10 pb-8 border-b border-gray-200">
          <p className="text-xs font-bold uppercase tracking-widest text-red-600 mb-2">Navigation</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Sitemap</h1>
          <p className="text-gray-500">A complete guide to all pages and sections on The Beacon website.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-10">
          {GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title}>
                <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">
                  <Icon size={14} />
                  {group.title}
                </h2>
                <ul className="space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group block p-3 rounded-lg border border-gray-100 hover:border-red-200 hover:bg-red-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-800 group-hover:text-red-700 text-sm">{link.label}</span>
                        {link.description && (
                          <span className="block text-xs text-gray-400 mt-0.5">{link.description}</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}
