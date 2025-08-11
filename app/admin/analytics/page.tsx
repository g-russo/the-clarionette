"use client";

import DashboardLayout from "../components/DashboardLayout";
import { SimpleChart } from "../components/SimpleChart";
import { BarChart3, Users, Eye, Clock, TrendingUp } from "lucide-react";

export default function AdminAnalytics() {
  // Mock analytics data
  const monthlyViews = [
    { label: "Jan", value: 15420 },
    { label: "Feb", value: 18350 },
    { label: "Mar", value: 22100 },
    { label: "Apr", value: 19800 },
    { label: "May", value: 25600 },
    { label: "Jun", value: 28900 }
  ];

  const trafficSources = [
    { label: "Direct", value: 45, color: "#dc2626" },
    { label: "Google Search", value: 32, color: "#059669" },
    { label: "Social Media", value: 15, color: "#7c3aed" },
    { label: "Referrals", value: 8, color: "#ea580c" }
  ];

  const popularPages = [
    { label: "/main/news", value: 3420 },
    { label: "/main/sports", value: 2890 },
    { label: "/main/features", value: 2156 },
    { label: "/main/literary", value: 1876 },
    { label: "/main/filipino", value: 1654 }
  ];

  const deviceStats = [
    { label: "Mobile", value: 58, color: "#3b82f6" },
    { label: "Desktop", value: 35, color: "#10b981" },
    { label: "Tablet", value: 7, color: "#f59e0b" }
  ];

  const timeOnSite = [
    { label: "0-30s", value: 25, color: "#ef4444" },
    { label: "30s-1m", value: 30, color: "#f97316" },
    { label: "1-3m", value: 28, color: "#eab308" },
    { label: "3-5m", value: 12, color: "#22c55e" },
    { label: "5m+", value: 5, color: "#16a34a" }
  ];

  return (
    <DashboardLayout title="Analytics">
      <div className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Page Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">142,350</p>
                <p className="text-sm text-green-600 mt-1">+12.5% from last month</p>
              </div>
              <Eye className="w-10 h-10 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Unique Visitors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">28,456</p>
                <p className="text-sm text-green-600 mt-1">+8.2% from last month</p>
              </div>
              <Users className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Session Duration</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">2m 34s</p>
                <p className="text-sm text-green-600 mt-1">+5.1% from last month</p>
              </div>
              <Clock className="w-10 h-10 text-purple-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Bounce Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">34.2%</p>
                <p className="text-sm text-red-600 mt-1">-2.8% from last month</p>
              </div>
              <TrendingUp className="w-10 h-10 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Main Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimpleChart
            data={monthlyViews}
            title="Monthly Page Views"
            type="line"
            height={350}
          />
          
          <SimpleChart
            data={trafficSources}
            title="Traffic Sources"
            type="doughnut"
            height={350}
          />
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <SimpleChart
            data={popularPages}
            title="Most Popular Pages"
            type="bar"
            height={300}
          />

          <SimpleChart
            data={deviceStats}
            title="Device Usage"
            type="doughnut"
            height={300}
          />

          <SimpleChart
            data={timeOnSite}
            title="Time on Site Distribution"
            type="doughnut"
            height={300}
          />
        </div>

        {/* Real-time Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Real-time Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse mx-auto mb-2"></div>
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-sm text-gray-600">Active users right now</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse mx-auto mb-2"></div>
              <p className="text-2xl font-bold text-gray-900">156</p>
              <p className="text-sm text-gray-600">Page views in last hour</p>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse mx-auto mb-2"></div>
              <p className="text-2xl font-bold text-gray-900">8</p>
              <p className="text-sm text-gray-600">New articles this week</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
