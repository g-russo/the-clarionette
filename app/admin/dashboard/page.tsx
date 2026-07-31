"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "../components/DashboardLayout";
import { SimpleChart } from "../components/SimpleChart";
import {
  Users, FileText, Eye, TrendingUp, Calendar,
  Clock, Loader2, AlertCircle, Tag,
} from "lucide-react";
import { getAnalyticsOverview, getAnalyticsByCategory, getTopArticles } from "@/lib/api/analytics";
import type { AnalyticsOverview, CategoryStat, TopArticle } from "@/lib/api/analytics";

const CATEGORY_LABELS: Record<string, string> = {
  news: "News", features: "Features", sports: "Sports", literary: "Literary", filipino: "Filipino",
};
const CATEGORY_COLORS: Record<string, string> = {
  news: "#3b82f6", features: "#7c3aed", sports: "#22c55e", literary: "#f59e0b", filipino: "#dc2626",
};

function formatNum(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

function relativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [topArticles, setTopArticles] = useState<TopArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken") ?? "";
    Promise.all([
      getAnalyticsOverview(token),
      getAnalyticsByCategory(token),
      getTopArticles(token, { limit: 5 }),
    ])
      .then(([ov, cat, top]) => {
        setOverview(ov);
        setCategories(cat.categories);
        setTopArticles(top.articles);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const categoryViewData = categories.map((c) => ({
    label: CATEGORY_LABELS[c.category] ?? c.category,
    value: c.totalViews,
    color: CATEGORY_COLORS[c.category] ?? "#6b7280",
  })).filter((d) => d.value > 0);

  const categoryCountData = categories.map((c) => ({
    label: CATEGORY_LABELS[c.category] ?? c.category,
    value: c.articleCount,
    color: CATEGORY_COLORS[c.category] ?? "#6b7280",
  })).filter((d) => d.value > 0);

  const topChartData = topArticles.map((a) => ({
    label: a.title.length > 35 ? a.title.slice(0, 35) + "…" : a.title,
    value: a.views,
  }));

  const stats = overview
    ? [
        { title: "Total Articles",  value: formatNum(overview.totalArticles),  sub: `${overview.publishedCount} published`,   icon: FileText,  color: "bg-blue-500"   },
        { title: "Total Views",     value: formatNum(overview.totalViews),      sub: "across all articles",                    icon: Eye,       color: "bg-green-500"  },
        { title: "In Review",       value: formatNum(overview.inReviewCount),   sub: `${overview.draftCount} drafts`,          icon: TrendingUp, color: "bg-orange-500" },
        { title: "New This Week",   value: formatNum(overview.newThisWeek),     sub: "articles created",                       icon: Users,     color: "bg-purple-500" },
      ]
    : [];

  if (loading) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
          <Loader2 size={24} className="animate-spin" /> Loading data…
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard">
        <div className="flex flex-col items-center justify-center h-64 gap-3 text-gray-400">
          <AlertCircle size={32} className="text-red-400" />
          <p className="text-sm">Could not load article data. Check your connection.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
                <div className={`${stat.color} p-3 rounded-xl shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-0.5">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{stat.sub}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SimpleChart data={categoryViewData}  title="Views by Category"    type="doughnut" height={300} />
          <SimpleChart data={categoryCountData} title="Articles by Category" type="doughnut" height={300} />
        </div>

        {/* Top articles + recent activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            {topChartData.length > 0 ? (
              <SimpleChart data={topChartData} title="Top Articles by Views" type="bar" height={340} />
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-center h-[340px] text-gray-400 text-sm">
                No published articles yet.
              </div>
            )}
          </div>

          {/* Recent top articles list */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">Top Articles</h3>
              <Clock className="w-4 h-4 text-gray-400" />
            </div>
            <div className="space-y-3">
              {topArticles.length === 0 && (
                <p className="text-xs text-gray-400">No articles yet.</p>
              )}
              {topArticles.map((a) => (
                <button
                  key={a._id}
                  onClick={() => router.push(`/admin/articles/${a._id}`)}
                  className="w-full text-left group"
                >
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-900 truncate group-hover:text-red-600 transition-colors">{a.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-0.5 text-xs text-gray-400">
                          <Tag size={9} /> {a.category}
                        </span>
                        {a.publishedAt && (
                          <span className="text-xs text-gray-400">{relativeTime(a.publishedAt)}</span>
                        )}
                        {a.views > 0 && (
                          <span className="flex items-center gap-0.5 text-xs text-gray-400">
                            <Eye size={9} /> {a.views.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => router.push("/admin/articles")}
              className="w-full mt-4 text-xs text-red-600 hover:text-red-700 font-medium"
            >
              View all articles →
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "New Article",  icon: FileText,   color: "text-red-600",    href: "/admin/articles/create" },
              { label: "Manage Users", icon: Users,      color: "text-blue-600",   href: "/admin/users"           },
              { label: "Events",       icon: Calendar,   color: "text-green-600",  href: "/admin/events"          },
              { label: "Analytics",    icon: TrendingUp, color: "text-purple-600", href: "/admin/analytics"       },
            ].map(({ label, icon: Icon, color, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Icon className={`w-7 h-7 ${color} mb-2`} />
                <span className="text-xs font-medium text-gray-900">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
