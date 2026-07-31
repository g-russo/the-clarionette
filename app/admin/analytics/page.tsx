"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { SimpleChart } from "../components/SimpleChart";
import { Eye, FileText, Clock, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import { getAnalyticsOverview, getAnalyticsByCategory, getTopArticles } from "@/lib/api/analytics";
import type { AnalyticsOverview, CategoryStat, TopArticle } from "@/lib/api/analytics";

const CATEGORY_LABELS: Record<string, string> = {
  news: "News", features: "Features", sports: "Sports", literary: "Literary", filipino: "Filipino",
};
const CATEGORY_COLORS: Record<string, string> = {
  news: "#3b82f6", features: "#7c3aed", sports: "#22c55e", literary: "#f59e0b", filipino: "#dc2626",
};
const STATUS_LABELS: Record<string, string> = {
  draft: "Draft", submitted: "Submitted", under_review: "Under Review",
  approved: "Approved", revision_requested: "Revision Req.", needs_media: "Needs Media",
  layout_claimed: "Layout Claimed", layout_in_progress: "Layout In Progress",
  submitted_for_final_approval: "Final Approval", ready_to_publish: "Ready",
  scheduled: "Scheduled", published: "Published", archived: "Archived",
};
const STATUS_COLORS = [
  "#dc2626","#f59e0b","#3b82f6","#22c55e","#7c3aed",
  "#06b6d4","#f97316","#84cc16","#a855f7","#ec4899","#10b981","#6b7280","#14b8a6",
];

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

export default function AdminAnalytics() {
  const [overview,    setOverview]    = useState<AnalyticsOverview | null>(null);
  const [categories,  setCategories]  = useState<CategoryStat[]>([]);
  const [topArticles, setTopArticles] = useState<TopArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken") ?? "";
    Promise.all([
      getAnalyticsOverview(token),
      getAnalyticsByCategory(token),
      getTopArticles(token, { limit: 10 }),
    ])
      .then(([ov, cat, top]) => {
        setOverview(ov);
        setCategories(cat.categories);
        setTopArticles(top.articles);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Chart data
  const categoryViewData = categories.map((c) => ({
    label: CATEGORY_LABELS[c.category] ?? c.category,
    value: c.totalViews,
    color: CATEGORY_COLORS[c.category] ?? "#6b7280",
  }));

  const categoryCountData = categories.map((c) => ({
    label: CATEGORY_LABELS[c.category] ?? c.category,
    value: c.articleCount,
    color: CATEGORY_COLORS[c.category] ?? "#6b7280",
  }));

  const topByViews = topArticles.map((a) => ({
    label: a.title.length > 32 ? a.title.slice(0, 32) + "…" : a.title,
    value: a.views,
  }));

  const workflowData = (overview?.workflowBreakdown ?? [])
    .sort((a, b) => b.count - a.count)
    .map((w, i) => ({
      label: STATUS_LABELS[w.status] ?? w.status,
      value: w.count,
      color: STATUS_COLORS[i % STATUS_COLORS.length],
    }));

  const metrics = overview
    ? [
        { title: "Total Article Views",  value: formatNum(overview.totalViews),     sub: "across all articles",           icon: Eye,       color: "text-blue-500"   },
        { title: "Published Articles",   value: formatNum(overview.publishedCount),  sub: `${overview.newThisMonth} new this month`, icon: FileText, color: "text-green-500" },
        { title: "Avg. Read Time",       value: overview.avgReadTime ? `${overview.avgReadTime} min` : "—", sub: "across published articles", icon: Clock, color: "text-purple-500" },
        { title: "New This Week",        value: formatNum(overview.newThisWeek),     sub: `${overview.totalArticles} articles total`, icon: TrendingUp, color: "text-orange-500" },
      ]
    : [];

  if (loading) {
    return (
      <DashboardLayout title="Analytics">
        <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
          <Loader2 size={24} className="animate-spin" /> Loading analytics…
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Analytics">
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-sm">Could not load analytics. Check your connection.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((m, i) => {
            const Icon = m.icon;
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{m.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{m.sub}</p>
                  </div>
                  <Icon className={`w-9 h-9 ${m.color} shrink-0`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Top articles + category views */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {topByViews.length > 0 ? (
            <SimpleChart data={topByViews}       title="Top Articles by Views"   type="bar"      height={360} />
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-center h-[360px] text-gray-400 text-sm">
              No view data yet.
            </div>
          )}
          <SimpleChart data={categoryViewData}   title="Total Views by Category" type="doughnut" height={360} />
        </div>

        {/* Category counts + workflow status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SimpleChart data={categoryCountData}  title="Articles by Category"    type="bar"      height={300} />
          <SimpleChart data={workflowData}       title="Articles by Status"      type="doughnut" height={300} />
        </div>

        {/* Scheduled article count callout */}
        {overview && overview.scheduledCount > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
            <Clock size={20} className="text-amber-500 shrink-0" />
            <p className="text-sm text-amber-800">
              <span className="font-semibold">{overview.scheduledCount}</span> article{overview.scheduledCount !== 1 ? "s" : ""} scheduled — the publish worker will pick {overview.scheduledCount !== 1 ? "them" : "it"} up automatically.
            </p>
          </div>
        )}

        {/* Most viewed article callout */}
        {overview?.mostViewed && overview.mostViewed.views > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Top Performing Article</h3>
            <div className="flex items-center gap-4">
              {overview.mostViewed.coverImage && (
                <img src={overview.mostViewed.coverImage} alt="" className="w-16 h-16 rounded-lg object-cover shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 truncate">{overview.mostViewed.title}</p>
                <p className="text-sm text-gray-500 mt-0.5 capitalize">
                  {overview.mostViewed.category} · {overview.mostViewed.readTime} min read
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <Eye size={13} className="text-red-500" />
                  <span className="text-sm font-bold text-red-600">
                    {overview.mostViewed.views.toLocaleString()} views
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
