"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../components/AuthContext";
import {
  Search, Plus, Edit, Trash2, Eye, Calendar, User, Tag, ChevronLeft, ChevronRight, AlertCircle,
} from "lucide-react";
import { WORKFLOW_STATUS_LABELS, WORKFLOW_STATUS_COLORS } from "@/types/workflow.types";
import type { ArticleListItem, ArticleWorkflowStatus } from "@/types";
import { listAdminArticles, deleteArticle } from "@/lib/api/articles";

const CATEGORIES = ["all", "news", "features", "sports", "literary", "filipino"] as const;
const STATUSES: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Statuses" },
  ...Object.entries(WORKFLOW_STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

export default function AdminArticles() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hasPermission } = useAuth();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | undefined>();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState("all");
  const [workflowStatus, setWorkflowStatus] = useState("all");
  const [deleteError, setDeleteError] = useState<string | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(() => {
    const token = localStorage.getItem("adminToken") ?? "";
    setLoading(true);
    setFetchError(undefined);
    listAdminArticles(token, {
      page,
      limit: 20,
      category: category !== "all" ? category : undefined,
      workflowStatus: workflowStatus !== "all" ? workflowStatus : undefined,
      search: search.trim() || undefined,
    })
      .then((res) => {
        setArticles(res.articles);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(() => setFetchError("Could not reach the server. Check that the backend is running."))
      .finally(() => setLoading(false));
  }, [page, category, workflowStatus, search]);

  useEffect(() => { load(); }, [load]);

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleCategory = (val: string) => { setCategory(val); setPage(1); };
  const handleStatus = (val: string) => { setWorkflowStatus(val); setPage(1); };

  const handleDelete = async (article: ArticleListItem) => {
    if (!confirm(`Delete "${article.title}"? This cannot be undone.`)) return;
    setDeleteError(undefined);
    setDeletingId(article._id);
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      await deleteArticle(article._id, token);
      setArticles((prev) => prev.filter((a) => a._id !== article._id));
      setTotal((t) => t - 1);
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <DashboardLayout title="Articles">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
              <input
                type="text"
                placeholder="Search articles…"
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-72"
              />
            </div>
            <select
              value={category}
              onChange={(e) => handleCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c === "all" ? "All Categories" : c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
            <select
              value={workflowStatus}
              onChange={(e) => handleStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            >
              {STATUSES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
          {hasPermission("create_articles") && (
            <button
              onClick={() => router.push("/admin/articles/create")}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shrink-0"
            >
              <Plus size={15} />
              New Article
            </button>
          )}
        </div>

        {deleteError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
            <AlertCircle size={14} />
            {deleteError}
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-sm text-gray-400">Loading…</div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
              <AlertCircle size={32} className="text-gray-300" />
              <p className="text-sm text-gray-600">{fetchError}</p>
              <button onClick={load} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Retry</button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Article</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Author</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Published</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Views</th>
                    <th className="text-left py-3 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {articles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                        No articles match your search.
                      </td>
                    </tr>
                  ) : (
                    articles.map((article) => (
                      <tr key={article._id} className="hover:bg-gray-50">
                        <td className="py-4 px-5">
                          <div className="max-w-xs">
                            <p className="font-medium text-gray-900 text-sm leading-snug line-clamp-2">{article.title}</p>
                            <div className="flex items-center text-xs text-gray-400 mt-1 gap-1">
                              <Calendar size={11} />
                              {article.publishedAt
                                ? new Date(article.publishedAt).toLocaleDateString()
                                : "Not published"}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            <Tag size={10} />
                            {article.category}
                          </span>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 text-xs flex items-center justify-center font-semibold shrink-0">
                              {article.author.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm text-gray-700 truncate max-w-[120px]">{article.author.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${WORKFLOW_STATUS_COLORS[article.workflowStatus as ArticleWorkflowStatus] ?? "bg-gray-100 text-gray-700"}`}>
                            {WORKFLOW_STATUS_LABELS[article.workflowStatus as ArticleWorkflowStatus] ?? article.workflowStatus}
                          </span>
                        </td>
                        <td className="py-4 px-5 text-sm text-gray-600">
                          {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : "—"}
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Eye size={13} className="text-gray-400" />
                            {article.views}
                          </div>
                        </td>
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => router.push(`/admin/articles/${article._id}`)}
                              title="View article"
                              className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded"
                            >
                              <Eye size={15} />
                            </button>
                            {hasPermission("edit_articles") && (
                              <button
                                onClick={() => router.push(`/admin/articles/${article._id}`)}
                                title="Edit article"
                                className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded"
                              >
                                <Edit size={15} />
                              </button>
                            )}
                            {hasPermission("oversee_all") && (
                              <button
                                onClick={() => handleDelete(article)}
                                disabled={deletingId === article._id}
                                title="Delete article"
                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded disabled:opacity-40"
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !fetchError && (
            <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-500">
                Showing {articles.length} of {total} articles
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => p - 1)}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40"
                >
                  <ChevronLeft size={13} /> Previous
                </button>
                <span className="text-xs text-gray-600">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40"
                >
                  Next <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
