"use client";

import DashboardLayout from "../components/DashboardLayout";
import { SimpleChart } from "../components/SimpleChart";
import { 
  Users, 
  FileText, 
  Eye, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Award,
  Clock
} from "lucide-react";

export default function AdminDashboard() {
  // Mock data - replace with real data from your backend
  const stats = [
    {
      title: "Total Articles",
      value: "127",
      change: "+12%",
      trend: "up",
      icon: FileText,
      color: "bg-blue-500"
    },
    {
      title: "Page Views",
      value: "23,456",
      change: "+8.3%",
      trend: "up",
      icon: Eye,
      color: "bg-green-500"
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+15.2%",
      trend: "up",
      icon: Users,
      color: "bg-purple-500"
    },
    {
      title: "Comments",
      value: "89",
      change: "-2.1%",
      trend: "down",
      icon: MessageSquare,
      color: "bg-orange-500"
    }
  ];

  const articleViews = [
    { label: "Mon", value: 120 },
    { label: "Tue", value: 190 },
    { label: "Wed", value: 300 },
    { label: "Thu", value: 500 },
    { label: "Fri", value: 200 },
    { label: "Sat", value: 300 },
    { label: "Sun", value: 450 }
  ];

  const categoryData = [
    { label: "News", value: 45, color: "#dc2626" },
    { label: "Sports", value: 30, color: "#059669" },
    { label: "Features", value: 25, color: "#7c3aed" },
    { label: "Literary", value: 20, color: "#ea580c" },
    { label: "Filipino", value: 15, color: "#0891b2" }
  ];

  const topArticles = [
    { label: "MCS Wins Championship", value: 1250 },
    { label: "New Academic Year Guide", value: 980 },
    { label: "Student Council Elections", value: 750 },
    { label: "Cultural Festival Highlights", value: 620 },
    { label: "Library Renovation Update", value: 450 }
  ];

  const recentActivities = [
    {
      action: "New article published",
      item: "MCS Basketball Team Advances to Finals",
      time: "2 minutes ago",
      user: "John Editor"
    },
    {
      action: "Article updated",
      item: "Student Council Meeting Summary",
      time: "15 minutes ago",
      user: "Jane Writer"
    },
    {
      action: "Comment approved",
      item: "Great job on the sports coverage!",
      time: "30 minutes ago",
      user: "Mike Admin"
    },
    {
      action: "New user registered",
      item: "Sarah Student joined as contributor",
      time: "1 hour ago",
      user: "System"
    },
    {
      action: "Media uploaded",
      item: "Championship celebration photos",
      time: "2 hours ago",
      user: "Photo Team"
    }
  ];

  return (
    <DashboardLayout title="Dashboard">
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className={`w-4 h-4 ${
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }`} />
                      <span className={`text-sm font-medium ml-1 ${
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SimpleChart
            data={articleViews}
            title="Article Views This Week"
            type="line"
            height={300}
          />
          
          <SimpleChart
            data={categoryData}
            title="Articles by Category"
            type="doughnut"
            height={300}
          />
        </div>

        {/* Secondary Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SimpleChart
              data={topArticles}
              title="Most Popular Articles This Month"
              type="bar"
              height={400}
            />
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
              <Clock className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span>
                    </p>
                    <p className="text-sm text-gray-600 truncate">{activity.item}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">{activity.user}</p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-red-600 hover:text-red-700 font-medium">
              View all activities
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <FileText className="w-8 h-8 text-red-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">New Article</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Users className="w-8 h-8 text-blue-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Manage Users</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-8 h-8 text-green-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">Add Event</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Award className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-sm font-medium text-gray-900">View Reports</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
