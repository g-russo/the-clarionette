"use client";

import { useState, useEffect, useCallback } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { useAuth } from "../components/AuthContext";
import {
  Search, MessageSquare, Check, X, Trash2, AlertCircle, ChevronLeft, ChevronRight,
} from "lucide-react";
import { COMMENT_STATUS_LABELS, COMMENT_STATUS_COLORS } from "@/types/comment.types";
import type { Comment, CommentStatus } from "@/types";
import { listAdminComments, approveComment, rejectComment, deleteComment } from "@/lib/api/comments";

const STATUS_FILTERS: Array<{ value: string; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function CommentsPage() {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | undefined>();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [actionError, setActionError] = useState<string | undefined>();

  const canManage = user?.roleSection === "management" || user?.permissions.includes("oversee_all");

  const load = useCallback(() => {
    const token = localStorage.getItem("adminToken") ?? "";
    setLoading(true);
    setFetchError(undefined);
    listAdminComments(token, { status: statusFilter, search: search.trim() || undefined, page, limit: 20 })
      .then((res) => {
        setComments(res.comments);
        setTotal(res.total);
        setTotalPages(res.totalPages);
      })
      .catch(() => setFetchError("Could not reach the server. Check that the backend is running."))
      .finally(() => setLoading(false));
  }, [statusFilter, search, page]);

  useEffect(() => { load(); }, [load]);

  const handleFilterChange = (val: string) => { setStatusFilter(val); setPage(1); };
  const handleSearch = (val: string) => { setSearch(val); setPage(1); };

  const updateLocalStatus = (id: string, newStatus: CommentStatus) => {
    setComments((prev) => prev.map((c) => c._id === id ? { ...c, status: newStatus } : c));
  };

  const removeLocal = (id: string) => {
    setComments((prev) => prev.filter((c) => c._id !== id));
    setTotal((t) => t - 1);
  };

  const handleApprove = async (comment: Comment) => {
    setActionError(undefined);
    const prev = comment.status;
    updateLocalStatus(comment._id, "approved");
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      await approveComment(token, comment._id);
    } catch (err) {
      updateLocalStatus(comment._id, prev as CommentStatus);
      setActionError(err instanceof Error ? err.message : "Action failed.");
    }
  };

  const handleReject = async (comment: Comment) => {
    setActionError(undefined);
    const prev = comment.status;
    updateLocalStatus(comment._id, "rejected");
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      await rejectComment(token, comment._id);
    } catch (err) {
      updateLocalStatus(comment._id, prev as CommentStatus);
      setActionError(err instanceof Error ? err.message : "Action failed.");
    }
  };

  const handleDelete = async (comment: Comment) => {
    if (!confirm(`Delete this comment by "${comment.authorName}"?`)) return;
    setActionError(undefined);
    removeLocal(comment._id);
    try {
      const token = localStorage.getItem("adminToken") ?? "";
      await deleteComment(token, comment._id);
    } catch (err) {
      load();
      setActionError(err instanceof Error ? err.message : "Delete failed.");
    }
  };

  // Stats derived from the full filtered list shown
  const pending = comments.filter((c) => c.status === "pending").length;
  const approved = comments.filter((c) => c.status === "approved").length;
  const rejected = comments.filter((c) => c.status === "rejected").length;

  return (
    <DashboardLayout title="Comments">
      <div className="space-y-6">
        {/* Stats bar */}
        <div className="flex gap-3 flex-wrap">
          {[
            { label: "Pending", count: pending, color: "bg-amber-100 text-amber-700 border-amber-200" },
            { label: "Approved", count: approved, color: "bg-green-100 text-green-700 border-green-200" },
            { label: "Rejected", count: rejected, color: "bg-red-100 text-red-700 border-red-200" },
          ].map(({ label, count, color }) => (
            <div key={label} className={`px-3 py-1.5 rounded-full border text-xs font-semibold ${color}`}>
              {label}: {count}
            </div>
          ))}
          <div className="px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 bg-gray-50">
            Total: {total}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by article or commenter…"
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex items-center rounded-lg border border-gray-300 overflow-hidden text-sm shrink-0">
            {STATUS_FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleFilterChange(value)}
                className={`px-3 py-2 transition-colors border-r border-gray-300 last:border-r-0 ${
                  statusFilter === value
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {actionError && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-2 text-sm text-red-700">
            <AlertCircle size={14} /> {actionError}
            <button onClick={() => setActionError(undefined)} className="ml-auto text-red-500 hover:text-red-700">
              <X size={13} />
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48 text-sm text-gray-400">Loading…</div>
          ) : fetchError ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3 text-center">
              <AlertCircle size={32} className="text-gray-300" />
              <p className="text-sm text-gray-600">{fetchError}</p>
              <button onClick={load} className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">Retry</button>
            </div>
          ) : comments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center text-gray-400">
              <MessageSquare size={32} className="mb-2 text-gray-300" />
              <p className="text-sm">
                {statusFilter === "all" ? "No comments yet." : `No ${statusFilter} comments.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Commenter</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Article</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Comment</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Date</th>
                    <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Status</th>
                    {canManage && (
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase tracking-wide">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {comments.map((comment) => (
                    <tr key={comment._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-xs font-semibold shrink-0">
                            {comment.authorName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{comment.authorName}</p>
                            {comment.authorEmail && (
                              <p className="text-xs text-gray-400">{comment.authorEmail}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-700 max-w-[160px] truncate">{comment.articleTitle}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600 max-w-xs line-clamp-2">{comment.content}</p>
                      </td>
                      <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${COMMENT_STATUS_COLORS[comment.status as CommentStatus] ?? "bg-gray-100 text-gray-700"}`}>
                          {COMMENT_STATUS_LABELS[comment.status as CommentStatus] ?? comment.status}
                        </span>
                      </td>
                      {canManage && (
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            {comment.status !== "approved" && (
                              <button
                                onClick={() => handleApprove(comment)}
                                title="Approve"
                                className="p-1.5 text-gray-400 hover:text-green-600 transition-colors"
                              >
                                <Check size={15} />
                              </button>
                            )}
                            {comment.status !== "rejected" && (
                              <button
                                onClick={() => handleReject(comment)}
                                title="Reject"
                                className="p-1.5 text-gray-400 hover:text-amber-600 transition-colors"
                              >
                                <X size={15} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(comment)}
                              title="Delete"
                              className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !fetchError && comments.length > 0 && (
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
              <p className="text-xs text-gray-500">Showing {comments.length} of {total}</p>
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
