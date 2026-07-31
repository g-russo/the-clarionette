"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { getPublicArticles } from "@/lib/api/articles";
import type { ArticleListItem } from "@/types";
import {
  Tag, Clock, User, ArrowRight, AlertCircle, Loader2,
  ChevronLeft, ChevronRight,
} from "lucide-react";

const LIMIT = 12;

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

const CATEGORY_ACCENT: Record<string, string> = {
  news:     "bg-blue-100 text-blue-700",
  features: "bg-purple-100 text-purple-700",
  sports:   "bg-green-100 text-green-700",
  literary: "bg-amber-100 text-amber-700",
  filipino: "bg-red-100 text-red-700",
};

function ArticleRow({ article }: { article: ArticleListItem }) {
  const accent = CATEGORY_ACCENT[article.category] ?? "bg-gray-100 text-gray-600";
  return (
    <article className="flex gap-4 py-5 border-b border-gray-100 last:border-0 group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full ${accent}`}>
            {article.category}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Clock size={11} /> {article.readTime} min
          </span>
          {article.featured && (
            <span className="text-xs font-bold bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
              Featured
            </span>
          )}
        </div>
        <h2 className="font-semibold text-gray-900 mb-1 leading-snug group-hover:text-red-600 transition-colors">
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h2>
        {article.excerpt && (
          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-2">{article.excerpt}</p>
        )}
        <span className="text-xs text-gray-400 flex items-center gap-1">
          <User size={11} /> <Link href={`/authors/${article.author._id}`} className="hover:text-red-600 transition-colors">{article.author.name}</Link>
          <span className="mx-1">·</span>
          {timeAgo(article.publishedAt ?? article.createdAt)}
        </span>
      </div>
      <Link
        href={`/articles/${article.slug}`}
        className="shrink-0 self-center text-sm font-medium text-red-600 hover:text-red-700 flex items-center gap-1 transition-colors"
      >
        Read <ArrowRight size={13} />
      </Link>
    </article>
  );
}

export default function TagArchivePage() {
  const params = useParams<{ tag: string }>();
  const tag = decodeURIComponent(params.tag ?? "");

  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!tag) return;
    setLoading(true);
    setError(null);
    getPublicArticles({ tag, page, limit: LIMIT })
      .then((res) => {
        setArticles(res.articles);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch(() => setError("Could not load articles. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, [tag, page]);

  return (
    <PageLayout>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 text-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Tag size={20} className="text-white" />
            </div>
            <div>
              <p className="text-white/60 text-xs uppercase tracking-widest font-medium mb-0.5">Tag</p>
              <h1 className="text-3xl font-bold capitalize">{tag}</h1>
            </div>
          </div>
          {!loading && (
            <p className="text-white/60 text-sm mt-3">
              {total === 0
                ? "No published articles found."
                : `${total} article${total === 1 ? "" : "s"} tagged with "${tag}"`}
            </p>
          )}
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading && (
          <div className="flex items-center justify-center h-48 gap-3 text-gray-400">
            <Loader2 size={22} className="animate-spin" />
            <span>Loading articles…</span>
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
            <Tag size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-600">No articles found</p>
            <p className="text-sm mt-1 mb-6">There are no published articles tagged "{tag}" yet.</p>
            <Link href="/" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">
              ← Back to home
            </Link>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <>
            <div>
              {articles.map((a) => <ArticleRow key={a._id} article={a} />)}
            </div>

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

        <div className="mt-8 pt-6 border-t border-gray-100">
          <Link href="/" className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors flex items-center gap-1.5">
            <ChevronLeft size={14} /> Back to home
          </Link>
        </div>
      </main>
    </PageLayout>
  );
}
