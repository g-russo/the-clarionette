"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { getPublicArticles } from "@/lib/api/articles";
import type { ArticleListItem } from "@/types";
import {
  Feather, Clock, ArrowRight, AlertCircle, Loader2,
  ChevronLeft, ChevronRight, Calendar,
} from "lucide-react";

type LayoutVariant = "editorial_list" | "full_grid" | "featured_hero" | "single_column";

const LIMIT = 12;

const CATEGORY_LABEL: Record<string, string> = {
  news: "News", features: "Features", sports: "Sports",
  literary: "Literary", filipino: "Filipino",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric", month: "long", day: "numeric",
  });
}

// ─── Layout components ────────────────────────────────────────────────────────

/** Byline-first card — default editorial feel */
function OpinionRow({ article }: { article: ArticleListItem }) {
  const initial = article.author.name.charAt(0).toUpperCase();
  return (
    <article className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group p-6">
      <div className="flex gap-4">
        <div className="shrink-0 w-12 h-12 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-lg font-bold overflow-hidden">
          {article.author.avatar
            ? <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
            : initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-2">
            <Link href={`/authors/${article.author._id}`} className="text-sm font-semibold text-gray-800 hover:text-red-600 transition-colors">{article.author.name}</Link>
            {article.author.roleName && (
              <span className="text-xs text-gray-400">· {article.author.roleName}</span>
            )}
            <span className="text-xs font-medium px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
              {CATEGORY_LABEL[article.category] ?? article.category}
            </span>
          </div>
          <h2 className="font-bold text-gray-900 text-lg leading-snug mb-2 group-hover:text-red-600 transition-colors">
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
          </h2>
          {article.excerpt && (
            <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">{article.excerpt}</p>
          )}
          <div className="flex items-center gap-x-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Calendar size={11} />{formatDate(article.publishedAt ?? article.createdAt)}</span>
            <span className="flex items-center gap-1"><Clock size={11} />{article.readTime} min read</span>
            <Link href={`/articles/${article.slug}`} className="ml-auto text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors">
              Read <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

/** Grid card */
function OpinionCard({ article }: { article: ArticleListItem }) {
  const initial = article.author.name.charAt(0).toUpperCase();
  return (
    <article className="bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all group p-5 flex flex-col">
      <div className="flex items-center gap-3 mb-3">
        <div className="shrink-0 w-9 h-9 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm font-bold overflow-hidden">
          {article.author.avatar
            ? <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
            : initial}
        </div>
        <div className="min-w-0">
          <Link href={`/authors/${article.author._id}`} className="text-sm font-semibold text-gray-800 truncate hover:text-red-600 transition-colors">{article.author.name}</Link>
          <p className="text-xs text-gray-400 truncate">{article.author.roleName ?? CATEGORY_LABEL[article.category]}</p>
        </div>
      </div>
      <h2 className="font-bold text-gray-900 leading-snug mb-2 group-hover:text-red-600 transition-colors flex-1">
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h2>
      {article.excerpt && (
        <p className="text-sm text-gray-500 line-clamp-3 mb-3">{article.excerpt}</p>
      )}
      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1"><Clock size={11} />{article.readTime} min</span>
        <Link href={`/articles/${article.slug}`} className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
          Read <ArrowRight size={11} />
        </Link>
      </div>
    </article>
  );
}

/** Large featured hero card */
function OpinionHero({ article }: { article: ArticleListItem }) {
  const initial = article.author.name.charAt(0).toUpperCase();
  return (
    <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-8 group">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-xl font-bold overflow-hidden shrink-0">
          {article.author.avatar
            ? <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
            : initial}
        </div>
        <div>
          <Link href={`/authors/${article.author._id}`} className="font-semibold text-gray-900 hover:text-red-600 transition-colors">{article.author.name}</Link>
          <p className="text-sm text-gray-500">{article.author.roleName ?? CATEGORY_LABEL[article.category]}</p>
        </div>
        {article.featured && (
          <span className="ml-auto text-xs font-bold bg-yellow-400 text-yellow-900 px-2.5 py-1 rounded-full uppercase tracking-wide">
            Featured
          </span>
        )}
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3 group-hover:text-red-600 transition-colors">
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h2>
      {article.excerpt && (
        <p className="text-gray-600 leading-relaxed mb-5 text-lg">{article.excerpt}</p>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1"><Calendar size={13} />{formatDate(article.publishedAt ?? article.createdAt)}</span>
          <span className="flex items-center gap-1"><Clock size={13} />{article.readTime} min read</span>
        </div>
        <Link href={`/articles/${article.slug}`} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors">
          Read <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

// ─── Layout renderers ─────────────────────────────────────────────────────────

function EditorialList({ articles }: { articles: ArticleListItem[] }) {
  return (
    <div className="space-y-4">
      {articles.map((a) => <OpinionRow key={a._id} article={a} />)}
    </div>
  );
}

function FullGrid({ articles }: { articles: ArticleListItem[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {articles.map((a) => <OpinionCard key={a._id} article={a} />)}
    </div>
  );
}

function FeaturedHero({ articles }: { articles: ArticleListItem[] }) {
  const featured = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a._id !== featured?._id);
  return (
    <>
      {featured && <OpinionHero article={featured} />}
      {rest.length > 0 && (
        <>
          <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-4">More Opinions</h2>
          <div className="space-y-4">
            {rest.map((a) => <OpinionRow key={a._id} article={a} />)}
          </div>
        </>
      )}
    </>
  );
}

function SingleColumn({ articles }: { articles: ArticleListItem[] }) {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {articles.map((a) => <OpinionRow key={a._id} article={a} />)}
    </div>
  );
}

function OpinionsContent({ articles, layout }: { articles: ArticleListItem[]; layout: LayoutVariant }) {
  switch (layout) {
    case "full_grid":      return <FullGrid articles={articles} />;
    case "featured_hero":  return <FeaturedHero articles={articles} />;
    case "single_column":  return <SingleColumn articles={articles} />;
    case "editorial_list":
    default:               return <EditorialList articles={articles} />;
  }
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function OpinionsPage() {
  const [layout, setLayout] = useState<LayoutVariant>("editorial_list");
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Load saved layout preference
  useEffect(() => {
    fetch("/api/layout-settings")
      .then((r) => r.json())
      .then((data) => { if (data.opinions) setLayout(data.opinions as LayoutVariant); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPublicArticles({ articleStyle: "opinion", page, limit: LIMIT })
      .then((res) => {
        setArticles(res.articles);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch(() => setError("Could not load opinion articles. Please try again later."))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-600 text-white py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
              <Feather size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Opinions</h1>
              <p className="text-white/60 text-sm mt-0.5">
                Perspectives, editorials, and voices from our staff
              </p>
            </div>
          </div>
          {!loading && total > 0 && (
            <p className="text-white/50 text-sm mt-4">
              {total} opinion piece{total !== 1 ? "s" : ""} published
            </p>
          )}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && (
          <div className="flex items-center justify-center h-48 gap-3 text-gray-400">
            <Loader2 size={22} className="animate-spin" />
            <span>Loading opinion pieces…</span>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-5 text-red-700">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <Feather size={52} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-600">No opinion pieces yet</p>
            <p className="text-sm mt-1">
              Editors can mark an article as an opinion piece when editing it in the admin panel.
            </p>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <>
            <OpinionsContent articles={articles} layout={layout} />

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={15} /> Previous
                </button>
                <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
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
