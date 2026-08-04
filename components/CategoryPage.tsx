"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { getPublicArticles } from "@/lib/api/articles";
import type { ArticleListItem, ArticleCategory } from "@/types";
import {
  Clock, User, ArrowRight, Newspaper, Feather, Trophy, BookOpen, Globe,
  ChevronLeft, ChevronRight, AlertCircle, Loader2,
} from "lucide-react";

type LayoutVariant = "full_grid" | "featured_hero" | "magazine" | "editorial_list" | "single_column";

type CategoryConfig = {
  category: ArticleCategory;
  label: string;
  tagline: string;
  accentColor: string;
  accentBg: string;
  heroBg: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
};

const CONFIGS: Record<ArticleCategory, CategoryConfig> = {
  news: {
    category: "news",
    label: "News",
    tagline: "Breaking stories, campus updates, and everything that matters today.",
    accentColor: "text-blue-600",
    accentBg: "bg-blue-100 text-blue-700",
    heroBg: "from-blue-900 to-blue-700",
    Icon: Newspaper,
  },
  features: {
    category: "features",
    label: "Features",
    tagline: "In-depth reporting, human interest stories, and investigative journalism.",
    accentColor: "text-purple-600",
    accentBg: "bg-purple-100 text-purple-700",
    heroBg: "from-purple-900 to-purple-700",
    Icon: Feather,
  },
  sports: {
    category: "sports",
    label: "Sports",
    tagline: "Championships, profiles, and everything happening on and off the field.",
    accentColor: "text-green-600",
    accentBg: "bg-green-100 text-green-700",
    heroBg: "from-green-900 to-green-700",
    Icon: Trophy,
  },
  literary: {
    category: "literary",
    label: "Literary",
    tagline: "Poetry, fiction, personal essays, and the art of putting things into words.",
    accentColor: "text-amber-600",
    accentBg: "bg-amber-100 text-amber-700",
    heroBg: "from-amber-900 to-amber-700",
    Icon: BookOpen,
  },
  filipino: {
    category: "filipino",
    label: "Filipino",
    tagline: "Mga kuwento, tula, at sanaysay sa wikang Filipino.",
    accentColor: "text-red-600",
    accentBg: "bg-red-100 text-red-700",
    heroBg: "from-red-900 to-red-700",
    Icon: Globe,
  },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

// ─── Layout components ────────────────────────────────────────────────────────

function ArticleCard({ article, config }: { article: ArticleListItem; config: CategoryConfig }) {
  const { Icon } = config;
  return (
    <article className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all group">
      <div className={`h-44 bg-gradient-to-br ${config.heroBg} flex items-center justify-center relative`}>
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <Icon size={48} className="text-white/20" />
        )}
        {article.featured && (
          <span className="absolute top-3 left-3 text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full uppercase tracking-wide">
            Featured
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2.5">
          <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${config.accentBg}`}>
            {config.label}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={11} /> {article.readTime} min
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-3 leading-relaxed">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <User size={11} /> {article.author.name}
            <span className="mx-1">·</span>
            {timeAgo(article.publishedAt ?? article.createdAt)}
          </span>
          <Link
            href={`/articles/${article.slug}`}
            className={`text-sm font-medium ${config.accentColor} hover:opacity-80 flex items-center gap-1 transition-opacity`}
          >
            Read <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function FeaturedArticleHero({ article, config }: { article: ArticleListItem; config: CategoryConfig }) {
  const { Icon } = config;
  return (
    <article className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-10">
      <div className="md:flex">
        <div className={`md:w-5/12 h-64 md:h-auto bg-gradient-to-br ${config.heroBg} flex items-center justify-center relative shrink-0`}>
          {article.coverImage ? (
            <img src={article.coverImage} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <Icon size={80} className="text-white/20" />
          )}
          <span className="absolute top-5 left-5 text-xs font-bold bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full uppercase tracking-wide">
            Featured
          </span>
        </div>
        <div className="p-8 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${config.accentBg}`}>
              {config.label}
            </span>
            <span className="text-sm text-gray-400 flex items-center gap-1">
              <Clock size={12} /> {article.readTime} min read
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 leading-tight">
            <Link href={`/articles/${article.slug}`} className="hover:text-red-600 transition-colors">
              {article.title}
            </Link>
          </h2>
          <p className="text-gray-600 mb-6 leading-relaxed line-clamp-3">{article.excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 flex items-center gap-1.5">
              <User size={13} /> {article.author.name}
              <span className="mx-1">·</span>
              {timeAgo(article.publishedAt ?? article.createdAt)}
            </span>
            <Link
              href={`/articles/${article.slug}`}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Read Story <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function EditorialListItem({ article, config }: { article: ArticleListItem; config: CategoryConfig }) {
  const { Icon } = config;
  return (
    <article className="bg-white rounded-lg border border-gray-100 hover:shadow-sm transition-all group flex gap-4 p-4">
      <div className={`w-20 h-20 shrink-0 bg-gradient-to-br ${config.heroBg} rounded-lg flex items-center justify-center relative overflow-hidden`}>
        {article.coverImage ? (
          <img src={article.coverImage} alt={article.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <Icon size={24} className="text-white/30" />
        )}
        {article.featured && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-yellow-400 rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${config.accentBg}`}>
            {config.label}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={10} /> {article.readTime} min
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors leading-snug text-sm mb-1">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="text-xs text-gray-500 line-clamp-2 mb-2">{article.excerpt}</p>
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <User size={10} /> {article.author.name} · {timeAgo(article.publishedAt ?? article.createdAt)}
        </span>
      </div>
      <Link
        href={`/articles/${article.slug}`}
        className={`shrink-0 self-center text-xs font-medium ${config.accentColor} hover:opacity-80 flex items-center gap-0.5`}
      >
        Read <ArrowRight size={12} />
      </Link>
    </article>
  );
}

// ─── Layout renderers ─────────────────────────────────────────────────────────

function FullGrid({ articles, config }: { articles: ArticleListItem[]; config: CategoryConfig }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((a) => <ArticleCard key={a._id} article={a} config={config} />)}
    </div>
  );
}

function FeaturedHeroLayout({ articles, config }: { articles: ArticleListItem[]; config: CategoryConfig }) {
  const featured = articles.find((a) => a.featured) ?? articles[0] ?? null;
  const rest = featured ? articles.filter((a) => a._id !== featured._id) : articles;
  return (
    <>
      {featured && <FeaturedArticleHero article={featured} config={config} />}
      {rest.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-6">More {config.label} Stories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((a) => <ArticleCard key={a._id} article={a} config={config} />)}
          </div>
        </>
      )}
    </>
  );
}

function MagazineLayout({ articles, config }: { articles: ArticleListItem[]; config: CategoryConfig }) {
  const { Icon } = config;
  const lead = articles[0] ?? null;
  const sidebar = articles.slice(1, 4);
  const rest = articles.slice(4);
  return (
    <>
      {lead && (
        <div className="md:flex gap-6 mb-10">
          {/* Lead article */}
          <article className="md:flex-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group mb-4 md:mb-0">
            <div className={`h-56 bg-gradient-to-br ${config.heroBg} flex items-center justify-center relative`}>
              {lead.coverImage ? (
                <img src={lead.coverImage} alt={lead.title} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <Icon size={64} className="text-white/20" />
              )}
              {lead.featured && (
                <span className="absolute top-4 left-4 text-xs font-bold bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Featured
                </span>
              )}
            </div>
            <div className="p-6">
              <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${config.accentBg} mb-3 inline-block`}>
                {config.label}
              </span>
              <h2 className="text-xl font-bold text-gray-900 mb-3 leading-snug group-hover:text-red-600 transition-colors">
                <Link href={`/articles/${lead.slug}`}>{lead.title}</Link>
              </h2>
              <p className="text-sm text-gray-500 line-clamp-3 mb-4">{lead.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  <User size={11} /> {lead.author.name} · {timeAgo(lead.publishedAt ?? lead.createdAt)}
                </span>
                <Link
                  href={`/articles/${lead.slug}`}
                  className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  Read <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          {sidebar.length > 0 && (
            <div className="md:w-72 shrink-0 space-y-3">
              {sidebar.map((a) => (
                <article key={a._id} className="bg-white rounded-lg border border-gray-100 p-4 hover:shadow-sm transition-all group">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`text-xs font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded ${config.accentBg}`}>
                      {config.label}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} /> {a.readTime} min</span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors mb-1">
                    <Link href={`/articles/${a.slug}`}>{a.title}</Link>
                  </h3>
                  <span className="text-xs text-gray-400"><User size={10} className="inline mr-1" />{a.author.name}</span>
                </article>
              ))}
            </div>
          )}
        </div>
      )}
      {rest.length > 0 && (
        <>
          <h2 className="text-xl font-bold text-gray-900 mb-6">More {config.label} Stories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((a) => <ArticleCard key={a._id} article={a} config={config} />)}
          </div>
        </>
      )}
    </>
  );
}

function EditorialListLayout({ articles, config }: { articles: ArticleListItem[]; config: CategoryConfig }) {
  return (
    <div className="space-y-3">
      {articles.map((a) => <EditorialListItem key={a._id} article={a} config={config} />)}
    </div>
  );
}

function SingleColumnLayout({ articles, config }: { articles: ArticleListItem[]; config: CategoryConfig }) {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {articles.map((a) => (
        <article key={a._id} className="border-b border-gray-100 pb-8 last:border-0 group">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${config.accentBg}`}>
              {config.label}
            </span>
            <span className="text-xs text-gray-400 flex items-center gap-1"><Clock size={10} /> {a.readTime} min</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2 leading-snug group-hover:text-red-600 transition-colors">
            <Link href={`/articles/${a.slug}`}>{a.title}</Link>
          </h2>
          <p className="text-gray-500 leading-relaxed mb-3">{a.excerpt}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400 flex items-center gap-1.5">
              <User size={12} /> {a.author.name} · {timeAgo(a.publishedAt ?? a.createdAt)}
            </span>
            <Link
              href={`/articles/${a.slug}`}
              className={`text-sm font-medium ${config.accentColor} hover:opacity-80 flex items-center gap-1`}
            >
              Read <ArrowRight size={13} />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

function ArticlesContent({
  articles,
  config,
  layout,
}: {
  articles: ArticleListItem[];
  config: CategoryConfig;
  layout: LayoutVariant;
}) {
  switch (layout) {
    case "full_grid":        return <FullGrid articles={articles} config={config} />;
    case "magazine":         return <MagazineLayout articles={articles} config={config} />;
    case "editorial_list":   return <EditorialListLayout articles={articles} config={config} />;
    case "single_column":    return <SingleColumnLayout articles={articles} config={config} />;
    case "featured_hero":
    default:                 return <FeaturedHeroLayout articles={articles} config={config} />;
  }
}

// ─── Main component ───────────────────────────────────────────────────────────

const LIMIT = 9;

export default function CategoryPage({ category }: { category: ArticleCategory }) {
  const config = CONFIGS[category];
  const { Icon } = config;

  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [layout, setLayout] = useState<LayoutVariant>("featured_hero");

  // Fetch the layout setting for this category from the server
  useEffect(() => {
    fetch("/api/layout-settings")
      .then((r) => r.json())
      .then((data) => {
        if (data[category]) setLayout(data[category] as LayoutVariant);
      })
      .catch(() => {});
  }, [category]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPublicArticles({ category, page, limit: LIMIT })
      .then((res) => {
        setArticles(res.articles);
        setTotalPages(res.totalPages);
      })
      .catch(() => setError("Could not load articles. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, [category, page]);

  return (
    <PageLayout>
      {/* Category header banner */}
      <div className={`bg-gradient-to-r ${config.heroBg} text-white py-14`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Icon size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">{config.label}</h1>
              <p className="text-white/70 mt-0.5">{config.tagline}</p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && (
          <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
            <Loader2 size={24} className="animate-spin" />
            <span>Loading articles…</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Failed to load articles</p>
              <p className="text-sm mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-24 text-gray-400">
            <Icon size={56} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-600">No published articles yet</p>
            <p className="text-sm mt-1">Check back soon.</p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <>
            <ArticlesContent articles={articles} config={config} layout={layout} />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={15} /> Previous
                </button>
                <span className="text-sm text-gray-500">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </PageLayout>
  );
}
