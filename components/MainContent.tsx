"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, ChevronRight, Facebook, Twitter, Instagram, Youtube, Loader2 } from "lucide-react";
import { getPublicArticles } from "@/lib/api/articles";
import { useSiteConfig } from "@/lib/hooks/useSiteConfig";
import type { ArticleListItem, ArticleCategory } from "@/types";

// ── Category config ───────────────────────────────────────────────────────────
const CATS: Record<ArticleCategory, { label: string; pill: string; grad: string }> = {
  news:     { label: "News",     pill: "bg-blue-600 text-white",    grad: "from-blue-950 to-blue-800"     },
  features: { label: "Features", pill: "bg-violet-600 text-white",  grad: "from-violet-950 to-violet-800" },
  sports:   { label: "Sports",   pill: "bg-emerald-600 text-white", grad: "from-emerald-950 to-emerald-800" },
  literary: { label: "Literary", pill: "bg-amber-500 text-white",   grad: "from-amber-900 to-amber-700"   },
  filipino: { label: "Filipino", pill: "bg-red-600 text-white",     grad: "from-red-950 to-red-800"       },
};

const SECTION_LIST: { slug: ArticleCategory; label: string }[] = [
  { slug: "news",     label: "News"     },
  { slug: "features", label: "Features" },
  { slug: "sports",   label: "Sports"   },
  { slug: "literary", label: "Literary" },
  { slug: "filipino", label: "Filipino" },
];

function ci(c: string) {
  return CATS[c as ArticleCategory] ?? { label: c, pill: "bg-gray-600 text-white", grad: "from-gray-800 to-gray-700" };
}

function fmtDate(d?: string, short = false) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-PH",
    short ? { month: "short", day: "numeric" } : { month: "long", day: "numeric", year: "numeric" }
  );
}

// ── Atoms ─────────────────────────────────────────────────────────────────────
function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.9a8.22 8.22 0 004.8 1.53V7a4.85 4.85 0 01-1.03-.31z" />
    </svg>
  );
}

function Cover({ article, className = "" }: { article: ArticleListItem; className?: string }) {
  const { grad, label } = ci(article.category);
  return article.coverImage ? (
    <img src={article.coverImage} alt={article.title} className={`w-full h-full object-cover ${className}`} />
  ) : (
    <div className={`w-full h-full bg-gradient-to-br ${grad} flex items-end p-3`}>
      <span className="text-white/20 text-xs font-black uppercase tracking-widest select-none">{label}</span>
    </div>
  );
}

function Pill({ category }: { category: string }) {
  const { label, pill } = ci(category);
  return (
    <span className={`inline-block text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm ${pill}`}>
      {label}
    </span>
  );
}

function SectionHead({ label, href }: { label: string; href: string }) {
  return (
    <div className="flex items-center gap-0 mb-5">
      <div className="w-1 h-6 bg-red-600 mr-3 rounded-sm shrink-0" />
      <h2 className="text-sm font-black uppercase tracking-widest text-gray-900 flex-1">{label}</h2>
      <Link href={href} className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 transition-colors">
        See all <ChevronRight size={12} />
      </Link>
    </div>
  );
}

// ── Article card variants ─────────────────────────────────────────────────────

// The large hero card — full image with gradient overlay text
function HeroPrimary({ article }: { article: ArticleListItem }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group relative block h-full bg-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <Cover article={article} className="group-hover:scale-105 transition-transform duration-700 ease-out" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-red-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-sm">
          Featured
        </span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7 z-10">
        <Pill category={article.category} />
        <h2 className="mt-2 text-white font-black text-xl sm:text-2xl md:text-3xl leading-tight line-clamp-3 group-hover:text-red-200 transition-colors">
          {article.title}
        </h2>
        <p className="mt-2 text-white/70 text-sm leading-relaxed line-clamp-2 hidden sm:block">{article.excerpt}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-white/55 text-xs">
          <span className="font-medium">{article.author.name}</span>
          <span>·</span>
          <span>{fmtDate(article.publishedAt ?? article.createdAt)}</span>
          {article.readTime > 0 && (
            <>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={9} /> {article.readTime} min read</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

// Stacked cards in the hero right column
function HeroSideCard({ article }: { article: ArticleListItem }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group flex gap-3 p-4 hover:bg-gray-50 transition-colors">
      <div className="w-24 h-[72px] shrink-0 overflow-hidden">
        <Cover article={article} className="group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="min-w-0 flex-1">
        <Pill category={article.category} />
        <h3 className="mt-1 text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
          {article.title}
        </h3>
        <div className="mt-1 text-xs text-gray-400 flex items-center gap-1">
          <Clock size={9} /> {article.readTime} min · {fmtDate(article.publishedAt ?? article.createdAt, true)}
        </div>
      </div>
    </Link>
  );
}

// Cards for the latest stories 3-column grid
function GridCard({ article }: { article: ArticleListItem }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group flex flex-col bg-white border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
      <div className="h-36 sm:h-44 overflow-hidden shrink-0">
        <Cover article={article} className="group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-3 flex flex-col flex-1">
        <Pill category={article.category} />
        <h3 className="mt-1.5 text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors flex-1">
          {article.title}
        </h3>
        <div className="mt-2 text-xs text-gray-400">
          {article.author.name} · {fmtDate(article.publishedAt ?? article.createdAt, true)}
        </div>
      </div>
    </Link>
  );
}

// Large card in each section's left column
function FeatureCard({ article }: { article: ArticleListItem }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <div className="h-52 overflow-hidden">
        <Cover article={article} className="group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="pt-3">
        <h3 className="text-base font-bold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
          {article.title}
        </h3>
        <p className="mt-1.5 text-sm text-gray-500 line-clamp-2 leading-relaxed">{article.excerpt}</p>
        <div className="mt-2 text-xs text-gray-400">
          {article.author.name} · {fmtDate(article.publishedAt ?? article.createdAt)} · {article.readTime} min read
        </div>
      </div>
    </Link>
  );
}

// Small horizontal cards in each section's right column
function SmallCard({ article }: { article: ArticleListItem }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group flex gap-3 py-3">
      <div className="w-[68px] h-[52px] shrink-0 overflow-hidden">
        <Cover article={article} className="group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="min-w-0 flex-1">
        <h4 className="text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
          {article.title}
        </h4>
        <div className="mt-1 text-xs text-gray-400">{fmtDate(article.publishedAt ?? article.createdAt, true)}</div>
      </div>
    </Link>
  );
}

// Sidebar most-read numbered list
function MostReadItem({ article, rank }: { article: ArticleListItem; rank: number }) {
  return (
    <Link href={`/articles/${article.slug}`} className="group flex gap-3 py-3 border-b border-gray-50 last:border-0">
      <span className="text-4xl font-black leading-none w-8 shrink-0 text-gray-100 select-none" aria-hidden>
        {rank}
      </span>
      <div className="min-w-0">
        <Pill category={article.category} />
        <h4 className="mt-1 text-[13px] font-semibold text-gray-900 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
          {article.title}
        </h4>
        <div className="mt-0.5 text-xs text-gray-400">{fmtDate(article.publishedAt ?? article.createdAt, true)}</div>
      </div>
    </Link>
  );
}

// ── Main page component ───────────────────────────────────────────────────────
export default function MainContent() {
  const config = useSiteConfig();

  const [hero,     setHero]     = useState<ArticleListItem[]>([]);
  const [latest,   setLatest]   = useState<ArticleListItem[]>([]);
  const [news,     setNews]     = useState<ArticleListItem[]>([]);
  const [sports,   setSports]   = useState<ArticleListItem[]>([]);
  const [features, setFeatures] = useState<ArticleListItem[]>([]);
  const [literary, setLiterary] = useState<ArticleListItem[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    Promise.all([
      getPublicArticles({ featured: true, limit: 4 }),
      getPublicArticles({ limit: 9 }),
      getPublicArticles({ category: "news",     limit: 4 }),
      getPublicArticles({ category: "sports",   limit: 4 }),
      getPublicArticles({ category: "features", limit: 4 }),
      getPublicArticles({ category: "literary", limit: 4 }),
    ])
      .then(([h, l, n, s, f, li]) => {
        // If no featured articles exist, borrow from latest
        const heroList = h.articles.length >= 2 ? h.articles : l.articles.slice(0, 4);
        setHero(heroList);
        setLatest(l.articles);
        setNews(n.articles);
        setSports(s.articles);
        setFeatures(f.articles);
        setLiterary(li.articles);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const heroMain = hero[0] ?? null;
  const heroSide = hero.slice(1, 4);

  // Most read: deduplicate all fetched articles, sort by views descending
  const seen = new Set<string>();
  const allArticles = [...latest, ...news, ...sports, ...features, ...literary].filter(a => {
    if (seen.has(a._id)) return false;
    seen.add(a._id);
    return true;
  });
  const mostRead = allArticles
    .sort((a, b) => (b.views ?? 0) - (a.views ?? 0))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-red-600" />
          <p className="text-sm text-gray-400">Loading stories…</p>
        </div>
      </div>
    );
  }

  const noContent = !heroMain && latest.length === 0;

  return (
    <main className="bg-gray-50 min-h-screen">

      {/* Breaking news bar ─────────────────────────────────────────────────── */}
      {heroMain && (
        <div className="bg-red-700 text-white text-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-3 overflow-hidden">
            <span className="shrink-0 bg-white text-red-700 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-sm">
              Featured
            </span>
            <Link href={`/articles/${heroMain.slug}`} className="truncate font-medium hover:underline underline-offset-2">
              {heroMain.title}
            </Link>
          </div>
        </div>
      )}

      {noContent ? (
        <div className="max-w-7xl mx-auto px-4 py-24 text-center text-gray-400">
          <p className="text-lg">No published articles yet. Check back soon.</p>
        </div>
      ) : (
        <>
          {/* Hero split ───────────────────────────────────────────────────── */}
          {heroMain && (
            <div className="bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                <div className="grid lg:grid-cols-12 gap-4 lg:gap-5">
                  {/* Big featured story */}
                  <div className="lg:col-span-7 xl:col-span-8 h-[340px] sm:h-[420px] overflow-hidden">
                    <HeroPrimary article={heroMain} />
                  </div>
                  {/* Stacked secondary stories */}
                  <div className="lg:col-span-5 xl:col-span-4 border border-gray-100 divide-y divide-gray-100 bg-white">
                    {(heroSide.length > 0 ? heroSide : latest.slice(0, 3)).map(a => (
                      <HeroSideCard key={a._id} article={a} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Latest stories — 3-column grid ─────────────────────────────── */}
          {latest.length > 0 && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-4">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-1 h-5 bg-red-600 rounded-sm shrink-0" />
                <span className="text-sm font-black uppercase tracking-widest text-gray-900">Latest Stories</span>
                <div className="flex-1 h-px bg-gray-200" />
                <Link href="/news" className="text-xs font-semibold text-red-600 hover:text-red-800 flex items-center gap-1 transition-colors">
                  View all <ChevronRight size={12} />
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {latest.slice(0, 9).map(a => <GridCard key={a._id} article={a} />)}
              </div>
            </div>
          )}

          {/* Thin rule */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="h-px bg-gray-200" />
          </div>

          {/* Section rows + sidebar ──────────────────────────────────────── */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <div className="grid lg:grid-cols-3 gap-8">

              {/* Article sections — 2/3 */}
              <div className="lg:col-span-2 space-y-10">

                {news.length > 0 && (
                  <section>
                    <SectionHead label="News" href="/news" />
                    <div className="grid md:grid-cols-2 gap-6">
                      <FeatureCard article={news[0]} />
                      <div className="divide-y divide-gray-100">
                        {news.slice(1).map(a => <SmallCard key={a._id} article={a} />)}
                      </div>
                    </div>
                  </section>
                )}

                {sports.length > 0 && (
                  <section>
                    <SectionHead label="Sports" href="/sports" />
                    <div className="grid md:grid-cols-2 gap-6">
                      <FeatureCard article={sports[0]} />
                      <div className="divide-y divide-gray-100">
                        {sports.slice(1).map(a => <SmallCard key={a._id} article={a} />)}
                      </div>
                    </div>
                  </section>
                )}

                {features.length > 0 && (
                  <section>
                    <SectionHead label="Features" href="/features" />
                    <div className="grid md:grid-cols-2 gap-6">
                      <FeatureCard article={features[0]} />
                      <div className="divide-y divide-gray-100">
                        {features.slice(1).map(a => <SmallCard key={a._id} article={a} />)}
                      </div>
                    </div>
                  </section>
                )}

                {literary.length > 0 && (
                  <section>
                    <SectionHead label="Literary" href="/literary" />
                    <div className="grid md:grid-cols-2 gap-6">
                      <FeatureCard article={literary[0]} />
                      <div className="divide-y divide-gray-100">
                        {literary.slice(1).map(a => <SmallCard key={a._id} article={a} />)}
                      </div>
                    </div>
                  </section>
                )}

              </div>

              {/* Sidebar — 1/3 */}
              <aside className="space-y-6">

                {/* Most Read */}
                {mostRead.length > 0 && (
                  <div className="bg-white border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-red-600">
                      <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Most Read</h2>
                    </div>
                    {mostRead.map((a, i) => <MostReadItem key={a._id} article={a} rank={i + 1} />)}
                  </div>
                )}

                {/* Follow Us */}
                {(config.facebook || config.twitter || config.instagram || config.youtube || config.tiktok) && (
                  <div className="bg-white border border-gray-100 p-5">
                    <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-red-600">
                      <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Follow Us</h2>
                    </div>
                    <div className="flex flex-col gap-2">
                      {config.facebook && (
                        <a href={config.facebook} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-3 py-2.5 bg-[#1877F2] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
                          <Facebook size={14} /> Facebook
                        </a>
                      )}
                      {config.twitter && (
                        <a href={config.twitter} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-3 py-2.5 bg-black text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
                          <Twitter size={14} /> Twitter / X
                        </a>
                      )}
                      {config.instagram && (
                        <a href={config.instagram} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-3 py-2.5 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
                          <Instagram size={14} /> Instagram
                        </a>
                      )}
                      {config.youtube && (
                        <a href={config.youtube} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-3 py-2.5 bg-[#FF0000] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
                          <Youtube size={14} /> YouTube
                        </a>
                      )}
                      {config.tiktok && (
                        <a href={config.tiktok} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2.5 px-3 py-2.5 bg-[#010101] text-white text-xs font-bold rounded hover:opacity-90 transition-opacity">
                          <TikTokIcon size={14} /> TikTok
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Browse sections */}
                <div className="bg-white border border-gray-100 p-5">
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b-2 border-red-600">
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-900">Browse</h2>
                  </div>
                  <div>
                    {SECTION_LIST.map(({ slug, label }) => (
                      <Link key={slug} href={`/${slug}`}
                        className="group flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 text-sm font-medium text-gray-700 hover:text-red-600 transition-colors">
                        {label}
                        <ChevronRight size={13} className="text-gray-300 group-hover:text-red-400 transition-colors" />
                      </Link>
                    ))}
                  </div>
                </div>

              </aside>
            </div>
          </div>

          {/* Newsletter ──────────────────────────────────────────────────── */}
          <section className="bg-gray-900 text-white py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-lg mx-auto text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-400 mb-2">Newsletter</p>
                <h2 className="text-2xl font-black mb-2">{config.name}</h2>
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  Stay informed. Get the latest stories from Harrow Hill High School delivered to your inbox.
                </p>
                <div className="flex gap-2 max-w-sm mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm rounded focus:outline-none focus:border-red-400 transition-colors"
                  />
                  <button className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded transition-colors whitespace-nowrap">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
