"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Users, 
  Settings, 
  BarChart3, 
  Calendar,
  MessageSquare,
  Upload,
  Eye,
  PlusCircle,
  Trash2,
  Edit
} from "lucide-react";

const menuItems = [
  {
    title: "Overview",
    items: [
      { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ]
  },
  {
    title: "Content Management",
    items: [
      { name: "Articles", href: "/admin/articles", icon: FileText },
      { name: "Create Article", href: "/admin/articles/create", icon: PlusCircle },
      { name: "Categories", href: "/admin/categories", icon: Edit },
    ]
  },
  {
    title: "Media & Assets",
    items: [
      { name: "Media Library", href: "/admin/media", icon: Upload },
      { name: "Gallery", href: "/admin/gallery", icon: Eye },
    ]
  },
  {
    title: "User Management",
    items: [
      { name: "Editorial Board", href: "/admin/users", icon: Users },
      { name: "Comments", href: "/admin/comments", icon: MessageSquare },
    ]
  },
  {
    title: "Website",
    items: [
      { name: "Events", href: "/admin/events", icon: Calendar },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ]
  }
];

interface AdminSidebarProps {
  isCollapsed: boolean;
}

export default function AdminSidebar({ isCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`bg-gray-900 text-white transition-all duration-300 ${
      isCollapsed ? "w-20" : "w-64"
    } min-h-screen flex flex-col`}>
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg">Admin Panel</h2>
              <p className="text-xs text-gray-400">The Clarionette</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6">
        {menuItems.map((section) => (
          <div key={section.title}>
            {!isCollapsed && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                {section.title}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-red-600 text-white"
                          : "text-gray-300 hover:bg-gray-800 hover:text-white"
                      }`}
                      title={isCollapsed ? item.name : undefined}
                    >
                      <Icon size={20} />
                      {!isCollapsed && <span>{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && (
          <div className="text-xs text-gray-400">
            <p>© 2024 The Clarionette</p>
            <p>Admin Dashboard v1.0</p>
          </div>
        )}
      </div>
    </div>
  );
}
