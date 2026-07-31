"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthContext";
import {
  Menu, Bell, Search, User, LogOut, Settings,
  ChevronDown, Home, CheckCheck, Loader2,
  FileText, CheckCircle, XCircle, AlertCircle,
  Image, Layout, Send, Globe, Archive, X,
} from "lucide-react";
import Link from "next/link";
import {
  getNotifications, markNotificationRead, markAllNotificationsRead,
  type AppNotification,
} from "@/lib/api/notifications";
import { listAdminArticles } from "@/lib/api/articles";
import type { ArticleListItem } from "@/types";
import { WORKFLOW_STATUS_COLORS, WORKFLOW_STATUS_LABELS } from "@/types/workflow.types";

interface AdminHeaderProps {
  onToggleSidebar: () => void;
}

const NOTIFICATION_ICONS: Record<string, React.ElementType> = {
  article_submitted:             FileText,
  article_under_review:          AlertCircle,
  article_approved:              CheckCircle,
  article_revision_requested:    XCircle,
  article_needs_media:           Image,
  article_pending_layout:        Layout,
  article_pending_final_approval:Send,
  article_published:             Globe,
  article_archived:              Archive,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  article_submitted:             "bg-blue-100 text-blue-600",
  article_under_review:          "bg-amber-100 text-amber-600",
  article_approved:              "bg-green-100 text-green-600",
  article_revision_requested:    "bg-red-100 text-red-600",
  article_needs_media:           "bg-purple-100 text-purple-600",
  article_pending_layout:        "bg-indigo-100 text-indigo-600",
  article_pending_final_approval:"bg-orange-100 text-orange-600",
  article_published:             "bg-emerald-100 text-emerald-600",
  article_archived:              "bg-gray-100 text-gray-500",
};

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminHeader({ onToggleSidebar }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifLoading, setNotifLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Header search state
  const [headerSearch, setHeaderSearch] = useState("");
  const [searchResults, setSearchResults] = useState<ArticleListItem[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchDrop, setShowSearchDrop] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const token = typeof window !== "undefined" ? localStorage.getItem("adminToken") ?? "" : "";

  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const data = await getNotifications(token);
      setNotifications(data.notifications);
      setUnreadCount(data.unreadCount);
    } catch {
      // silently fail — don't disrupt the UI
    }
  }, [token]);

  // Fetch on mount + poll every 30s
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close panels when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchDrop(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Debounced admin header search
  useEffect(() => {
    const q = headerSearch.trim();
    if (!q) { setSearchResults([]); setShowSearchDrop(false); return; }
    const t = setTimeout(() => {
      setSearchLoading(true);
      listAdminArticles(token, { search: q, limit: 6, page: 1 })
        .then((res) => { setSearchResults(res.articles); setShowSearchDrop(true); })
        .catch(() => {})
        .finally(() => setSearchLoading(false));
    }, 300);
    return () => clearTimeout(t);
  }, [headerSearch, token]);

  function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && headerSearch.trim()) {
      setShowSearchDrop(false);
      router.push(`/admin/articles?search=${encodeURIComponent(headerSearch.trim())}`);
    }
    if (e.key === "Escape") { setShowSearchDrop(false); }
  }

  function goToAllResults() {
    setShowSearchDrop(false);
    router.push(`/admin/articles?search=${encodeURIComponent(headerSearch.trim())}`);
  }

  async function handleMarkRead(n: AppNotification) {
    if (!n.read) {
      markNotificationRead(token, n._id).catch(() => {});
      setNotifications((prev) =>
        prev.map((x) => (x._id === n._id ? { ...x, read: true } : x))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    }
    if (n.entityId && n.entityType === "article") {
      setShowNotifications(false);
      router.push(`/admin/articles/${n.entityId}`);
    }
  }

  async function handleMarkAllRead() {
    setNotifLoading(true);
    try {
      await markAllNotificationsRead(token);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } finally {
      setNotifLoading(false);
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} />
          </button>

          {/* Header search with live dropdown */}
          <div className="relative w-80" ref={searchRef}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              onFocus={() => { if (searchResults.length > 0) setShowSearchDrop(true); }}
              placeholder="Search articles…"
              className="pl-10 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent w-full text-sm"
            />
            {searchLoading && (
              <Loader2 size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
            )}
            {headerSearch && !searchLoading && (
              <button
                onClick={() => { setHeaderSearch(""); setSearchResults([]); setShowSearchDrop(false); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}

            {/* Dropdown */}
            {showSearchDrop && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-xl z-50 overflow-hidden">
                {searchResults.length === 0 ? (
                  <p className="px-4 py-3 text-sm text-gray-400">No articles found</p>
                ) : (
                  <>
                    <div className="divide-y divide-gray-50">
                      {searchResults.map((a) => (
                        <button
                          key={a._id}
                          onClick={() => { setShowSearchDrop(false); router.push(`/admin/articles/${a._id}`); }}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-start gap-3"
                        >
                          <FileText size={15} className="text-gray-400 shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{a.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-xs text-gray-400 capitalize">{a.category}</span>
                              <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${WORKFLOW_STATUS_COLORS[a.workflowStatus as keyof typeof WORKFLOW_STATUS_COLORS] ?? "bg-gray-100 text-gray-600"}`}>
                                {WORKFLOW_STATUS_LABELS[a.workflowStatus as keyof typeof WORKFLOW_STATUS_LABELS] ?? a.workflowStatus}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={goToAllResults}
                      className="w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium text-center border-t border-gray-100 transition-colors"
                    >
                      See all results for "{headerSearch}"
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <Home size={16} />
            <span className="text-sm font-medium">View Site</span>
          </Link>

          {/* Notifications */}
          <div className="relative" ref={panelRef}>
            <button
              onClick={() => setShowNotifications((v) => !v)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center font-medium">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllRead}
                      disabled={notifLoading}
                      className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50 transition-colors"
                    >
                      {notifLoading
                        ? <Loader2 size={12} className="animate-spin" />
                        : <CheckCheck size={12} />}
                      Mark all read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                  {notifications.length === 0 ? (
                    <div className="py-10 text-center text-gray-400">
                      <Bell size={28} className="mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map((n) => {
                      const Icon = NOTIFICATION_ICONS[n.type] ?? Bell;
                      const iconClass = NOTIFICATION_COLORS[n.type] ?? "bg-gray-100 text-gray-500";
                      return (
                        <button
                          key={n._id}
                          onClick={() => handleMarkRead(n)}
                          className={`w-full text-left px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors ${
                            !n.read ? "bg-blue-50/60" : ""
                          }`}
                        >
                          <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
                            <Icon size={14} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm leading-snug ${!n.read ? "font-medium text-gray-900" : "text-gray-700"}`}>
                              {n.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">{relativeTime(n.createdAt)}</p>
                          </div>
                          {!n.read && (
                            <span className="shrink-0 w-2 h-2 rounded-full bg-red-500 mt-2" />
                          )}
                        </button>
                      );
                    })
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-400 text-center">
                      Showing latest {notifications.length} notifications
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu((v) => !v)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
              )}
              <div className="text-left hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.roleName}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.roleName ?? "Administrator"}</p>
                </div>
                <Link
                  href="/admin/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
