"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { getPublicArticles } from "@/lib/api/articles";
import type { ArticleListItem } from "@/types";
import {
  Search, Loader2, AlertCircle, Clock, Calendar,
  ArrowRight, FileText, ChevronLeft, ChevronRight,
} from "lucide-react";

const CATEGORY_COLORS: Record<string, string> = {
  news:     "bg-blue-100 text-blue-700",
  features: "bg-purple-100 text-purple-700",
  sports:   "bg-green-100 text-green-700",
  literary: "bg-amber-100 text-amber-700",
  filipino: "bg-red-100 text-red-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function ArticleCard({ article }: { article: ArticleListItem }) {
  return (
    <article className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all group">
      <div className="flex gap-4">
        {article.coverImage && (
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${CATEGORY_COLORS[article.category] ?? "bg-gray-100 text-gray-600"}`}>
              {article.category}
            </span>
          </div>
          <h2 className="font-bold text-gray-900 leading-snug mb-1.5 group-hover:text-red-600 transition-colors line-clamp-2">
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
          </h2>
          {article.excerpt && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-2 leading-relaxed">
              {article.excerpt}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
            <Link href={`/authors/${article.author._id}`} className="hover:text-red-600 transition-colors">{article.author.name}</Link>
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(article.publishedAt ?? article.createdAt)}
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {article.readTime} min read
            </span>
            <Link
              href={`/articles/${article.slug}`}
              className="ml-auto text-red-600 hover:text-red-700 font-medium flex items-center gap-1 transition-colors"
            >
              Read <ArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

const LIMIT = 10;

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [committed, setCommitted] = useState(searchParams.get("q") ?? "");
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(!!searchParams.get("q"));

  // Debounce: commit the query 400ms after the user stops typing
  useEffect(() => {
    const t = setTimeout(() => {
      setCommitted(query.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  // Fetch when committed query or page changes
  useEffect(() => {
    if (!committed) {
      setArticles([]);
      setTotal(0);
      setSearched(false);
      return;
    }
    setLoading(true);
    setError(null);
    setSearched(true);
    getPublicArticles({ search: committed, page, limit: LIMIT })
      .then((res) => {
        setArticles(res.articles);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(() => setError("Could not reach the server. Please try again."))
      .finally(() => setLoading(false));
  }, [committed, page]);

  // Sync URL
  useEffect(() => {
    const url = committed ? `/search?q=${encodeURIComponent(committed)}` : "/search";
    router.replace(url, { scroll: false });
  }, [committed, router]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      setCommitted(query.trim());
      setPage(1);
    }
  }

  return (
    <PageLayout>
      {/* Search hero */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Search</h1>
          <p className="text-white/60 text-sm mb-8">
            Find articles across all sections of The Beacon
          </p>
          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
            />
            <input
              ref={inputRef}
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search articles, topics, authors…"
              className="w-full pl-12 pr-4 py-4 text-base bg-white rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 placeholder-gray-400"
            />
            {loading && (
              <Loader2
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
              />
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Result count */}
        {searched && !loading && !error && (
          <p className="text-sm text-gray-500 mb-6">
            {total === 0
              ? `No results for "${committed}"`
              : `${total} result${total !== 1 ? "s" : ""} for "${committed}"`}
          </p>
        )}

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 mb-6">
            <AlertCircle size={18} className="shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-16" />
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No results */}
        {!loading && searched && total === 0 && !error && (
          <div className="text-center py-16 text-gray-400">
            <FileText size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium text-gray-600">No articles found</p>
            <p className="text-sm mt-1">Try different keywords or browse by section</p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {["news", "features", "sports", "literary", "filipino"].map((cat) => (
                <Link
                  key={cat}
                  href={`/${cat}`}
                  className="px-4 py-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-full text-sm font-medium capitalize transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty state before search */}
        {!loading && !searched && (
          <div className="text-center py-16 text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-gray-500">Start typing to search articles</p>
          </div>
        )}

        {/* Results list */}
        {!loading && articles.length > 0 && (
          <>
            <div className="space-y-4">
              {articles.map((a) => <ArticleCard key={a._id} article={a} />)}
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
      </main>
    </PageLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageContent />
    </Suspense>
  );
}
