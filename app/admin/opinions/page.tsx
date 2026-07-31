"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../components/AuthContext";
import {
  Search, Plus, Edit, Eye, ChevronLeft, ChevronRight,
  AlertCircle, Feather, Calendar, Tag, ShieldAlert,
  LayoutList, Monitor,
} from "lucide-react";
import { WORKFLOW_STATUS_LABELS, WORKFLOW_STATUS_COLORS } from "@/types/workflow.types";
import type { ArticleListItem, ArticleWorkflowStatus } from "@/types";
import { listAdminArticles, getPublicArticles } from "@/lib/api/articles";

// ─── Access gate ──────────────────────────────────────────────────────────────

function AccessDenied() {
  return (
    <div className="flex flex-col items-center justify-center h-72 gap-4 text-center px-6">
      <ShieldAlert size={48} className="text-gray-300" />
      <div>
        <p className="text-lg font-semibold text-gray-700">Access restricted</p>
        <p className="text-sm text-gray-500 mt-1">
          The Opinions section is only accessible to editorial and management staff.
        </p>
      </div>
    </div>
  );
}

// ─── Manage tab ───────────────────────────────────────────────────────────────

const CATEGORIES = ["all", "news", "features", "sports", "literary", "filipino"] as const;
const STATUSES: Array<{ value: string; label: string }> = [
  { value: "all", label: "All Statuses" },
  ...Object.entries(WORKFLOW_STATUS_LABELS).map(([value, label]) => ({ value, label })),
];

function ManageTab({ canCreate }: { canCreate: boolean }) {
  const router = useRouter();
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [workflowStatus, setWorkflowStatus] = useState("all");

  const load = useCallback(() => {
    const token = localStorage.getItem("adminToken") ?? "";
    setLoading(true);
    setFetchError(undefined);
    listAdminArticles(token, {
      page,
      limit: 20,
      articleStyle: "opinion",
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

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={15} />
            <input
              type="text"
              placeholder="Search opinions…"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-60"
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
        {canCreate && (
          <button
            onClick={() => router.push("/admin/articles/create")}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors shrink-0"
          >
            <Plus size={15} /> New Opinion Piece
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48 text-sm text-gray-400">Loading…</div>
        ) : fetchError ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3 text-center px-6">
            <AlertCircle size={32} className="text-gray-300" />
            <p className="text-sm text-gray-600">{fetchError}</p>
            <button onClick={load} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Retry</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Title</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Category</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Author</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Published</th>
                  <th className="text-left py-3 px-5 text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <Feather size={36} className="mx-auto mb-3 text-gray-200" />
                      <p className="text-sm text-gray-400">
                        {search || category !== "all" || workflowStatus !== "all"
                          ? "No opinion pieces match your filters."
                          : 'No opinion pieces yet. Create an article and set its style to "Opinion" in the editor.'}
                      </p>
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
                          <Tag size={10} /> {article.category}
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
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/articles/${article._id}`)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Edit"
                          >
                            <Edit size={15} />
                          </button>
                          {article.workflowStatus === "published" && (
                            <a
                              href={`/articles/${article.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                              title="View live"
                            >
                              <Eye size={15} />
                            </a>
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
      </div>

      {/* Pagination */}
      {!loading && !fetchError && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">Page {page} of {totalPages} · {total} total</p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Reader view tab ──────────────────────────────────────────────────────────

const CATEGORY_LABEL: Record<string, string> = {
  news: "News", features: "Features", sports: "Sports",
  literary: "Literary", filipino: "Filipino",
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-PH", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function ReaderViewTab() {
  const [articles, setArticles] = useState<ArticleListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getPublicArticles({ articleStyle: "opinion", page, limit: 10 })
      .then((res) => {
        setArticles(res.articles);
        setTotalPages(res.totalPages);
        setTotal(res.total);
      })
      .catch(() => setError("Could not load published opinion pieces."))
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-5">
      {/* Preview notice */}
      <div className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-600">
        <Monitor size={16} className="shrink-0 mt-0.5 text-slate-400" />
        <span>
          This is a preview of the{" "}
          <Link href="/opinions" target="_blank" className="font-medium underline underline-offset-2 hover:text-red-600">
            public Opinions page
          </Link>{" "}
          — only published pieces appear here. Drafts and articles in review are shown in the Manage tab.
        </span>
      </div>

      {loading && (
        <div className="flex items-center justify-center h-40 text-sm text-gray-400">Loading…</div>
      )}

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="shrink-0 mt-0.5" /> {error}
        </div>
      )}

      {!loading && !error && articles.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Feather size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium text-gray-600">No published opinion pieces yet</p>
          <p className="text-xs mt-1 text-gray-400">Published articles with the "Opinion" style will appear here.</p>
        </div>
      )}

      {!loading && !error && articles.length > 0 && (
        <>
          <p className="text-xs text-gray-400">{total} published piece{total !== 1 ? "s" : ""}</p>
          <div className="space-y-4">
            {articles.map((article) => {
              const initial = article.author.name.charAt(0).toUpperCase();
              return (
                <article key={article._id} className="bg-white rounded-xl border border-gray-200 p-5 flex gap-4">
                  {/* Author avatar */}
                  <div className="shrink-0 w-10 h-10 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-sm font-bold overflow-hidden">
                    {article.author.avatar
                      ? <img src={article.author.avatar} alt={article.author.name} className="w-full h-full object-cover" />
                      : initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-1.5">
                      <span className="text-sm font-semibold text-gray-800">{article.author.name}</span>
                      {article.author.roleName && (
                        <span className="text-xs text-gray-400">· {article.author.roleName}</span>
                      )}
                      <span className="text-xs font-medium px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
                        {CATEGORY_LABEL[article.category] ?? article.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-900 leading-snug mb-1">
                      <Link href={`/articles/${article.slug}`} target="_blank" className="hover:text-red-600 transition-colors">
                        {article.title}
                      </Link>
                    </h3>
                    {article.excerpt && (
                      <p className="text-sm text-gray-500 line-clamp-2 mb-2">{article.excerpt}</p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {formatDate(article.publishedAt ?? article.createdAt)}
                      </span>
                      <a
                        href={`/articles/${article.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-auto flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
                      >
                        <Eye size={12} /> View live
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

type Tab = "manage" | "reader";

export default function AdminOpinions() {
  const { user, hasPermission } = useAuth();
  const [tab, setTab] = useState<Tab>("manage");

  const isEditorialStaff =
    user?.roleSection === "editorial" ||
    user?.roleSection === "management" ||
    hasPermission("oversee_all");

  return (
    <DashboardLayout title="Opinions">
      {!isEditorialStaff ? (
        <AccessDenied />
      ) : (
        <div className="space-y-6">
          {/* Page header + tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                <Feather size={18} className="text-slate-600" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">Opinion Pieces</h2>
                <p className="text-xs text-gray-500">Editorial staff only</p>
              </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 self-start sm:self-auto">
              <button
                onClick={() => setTab("manage")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  tab === "manage" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <LayoutList size={14} /> Manage
              </button>
              <button
                onClick={() => setTab("reader")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  tab === "reader" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Monitor size={14} /> Reader View
              </button>
            </div>
          </div>

          {tab === "manage" ? (
            <ManageTab canCreate={hasPermission("create_articles")} />
          ) : (
            <ReaderViewTab />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
