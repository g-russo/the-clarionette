"use client";

import { useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  User,
  Tag,
  MoreVertical
} from "lucide-react";

export default function AdminArticles() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Mock articles data
  const articles = [
    {
      id: 1,
      title: "MCS Basketball Team Advances to Regional Championships",
      category: "Sports",
      author: "John Sports",
      status: "published",
      publishDate: "2024-06-20",
      views: 1250,
      comments: 8
    },
    {
      id: 2,
      title: "New Academic Year Registration Guidelines",
      category: "News",
      author: "Jane Admin",
      status: "published",
      publishDate: "2024-06-18",
      views: 980,
      comments: 12
    },
    {
      id: 3,
      title: "Student Council Election Results",
      category: "News",
      author: "Mike Editor",
      status: "published",
      publishDate: "2024-06-15",
      views: 750,
      comments: 15
    },
    {
      id: 4,
      title: "Creative Writing Workshop Success",
      category: "Literary",
      author: "Sarah Writer",
      status: "draft",
      publishDate: null,
      views: 0,
      comments: 0
    },
    {
      id: 5,
      title: "Upcoming Cultural Festival Preparations",
      category: "Features",
      author: "Ana Culture",
      status: "review",
      publishDate: null,
      views: 0,
      comments: 2
    }
  ];

  const categories = ["all", "News", "Sports", "Features", "Literary", "Filipino"];
  const statuses = ["all", "published", "draft", "review"];

  const getStatusBadge = (status: string) => {
    const styles = {
      published: "bg-green-100 text-green-800",
      draft: "bg-gray-100 text-gray-800",
      review: "bg-yellow-100 text-yellow-800"
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesStatus = selectedStatus === "all" || article.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <DashboardLayout title="Articles">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-80"
              />
            </div>

            {/* Filters */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {status === "all" ? "All Statuses" : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors">
            <Plus size={16} />
            <span>New Article</span>
          </button>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900">Article</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900">Category</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900">Author</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900">Published</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900">Views</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div>
                        <h3 className="font-medium text-gray-900 mb-1">{article.title}</h3>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={14} className="mr-1" />
                          {article.publishDate ? new Date(article.publishDate).toLocaleDateString() : "Not published"}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Tag size={12} className="mr-1" />
                        {article.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <User size={14} className="mr-2 text-gray-400" />
                        <span className="text-sm text-gray-900">{article.author}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(article.status)}`}>
                        {article.status.charAt(0).toUpperCase() + article.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-gray-900">
                        {article.publishDate ? new Date(article.publishDate).toLocaleDateString() : "-"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <Eye size={14} className="mr-1 text-gray-400" />
                        <span className="text-sm text-gray-900">{article.views}</span>
                        <span className="text-xs text-gray-500 ml-2">({article.comments} comments)</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye size={16} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit size={16} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 size={16} />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredArticles.length}</span> of{" "}
                <span className="font-medium">{articles.length}</span> articles
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm bg-white border border-gray-300 rounded hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
