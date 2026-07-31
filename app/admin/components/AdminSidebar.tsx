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
  Edit,
  Shield,
  LayoutTemplate,
  Feather,
} from "lucide-react";
import { useAuth } from "./AuthContext";

interface AdminSidebarProps {
  isCollapsed: boolean;
}

export default function AdminSidebar({ isCollapsed }: AdminSidebarProps) {
  const pathname = usePathname();
  const { hasPermission, user } = useAuth();
  const isEditorialStaff =
    user?.roleSection === "editorial" ||
    user?.roleSection === "management" ||
    hasPermission("oversee_all");

  const menuSections = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard, show: true },
        { name: "Analytics", href: "/admin/analytics", icon: BarChart3, show: true },
      ],
    },
    {
      title: "Content Management",
      items: [
        { name: "Articles", href: "/admin/articles", icon: FileText, show: true },
        {
          name: "Create Article",
          href: "/admin/articles/create",
          icon: PlusCircle,
          show: hasPermission("create_articles"),
        },
        { name: "Opinions", href: "/admin/opinions", icon: Feather, show: isEditorialStaff },
        { name: "Categories", href: "/admin/categories", icon: Edit, show: true },
      ],
    },
    {
      title: "Media & Assets",
      items: [
        {
          name: "Media Library",
          href: "/admin/media",
          icon: Upload,
          show: hasPermission("upload_images") || hasPermission("select_images_for_posting"),
        },
        { name: "Gallery", href: "/admin/gallery", icon: Eye, show: true },
      ],
    },
    {
      title: "People",
      items: [
        {
          name: "Users",
          href: "/admin/users",
          icon: Users,
          show: hasPermission("manage_users"),
        },
        {
          name: "Roles",
          href: "/admin/roles",
          icon: Shield,
          show: hasPermission("manage_roles"),
        },
        { name: "Comments", href: "/admin/comments", icon: MessageSquare, show: true },
      ],
    },
    {
      title: "Website",
      items: [
        { name: "Events", href: "/admin/events", icon: Calendar, show: true },
        { name: "Page Layouts", href: "/admin/page-layouts", icon: LayoutTemplate, show: hasPermission("layout_page") },
        { name: "Settings", href: "/admin/settings", icon: Settings, show: true },
      ],
    },
  ];

  return (
    <div
      className={`bg-gray-900 text-white transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } min-h-screen flex flex-col`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="font-bold text-lg">Admin Panel</h2>
              <p className="text-xs text-gray-400">The Beacon</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
        {menuSections.map((section) => {
          const visibleItems = section.items.filter((item) => item.show);
          if (visibleItems.length === 0) return null;

          return (
            <div key={section.title}>
              {!isCollapsed && (
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {section.title}
                </h3>
              )}
              <ul className="space-y-1">
                {visibleItems.map((item) => {
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
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && (
          <div className="text-xs text-gray-400">
            <p>© 2024 The Beacon</p>
            <p>Admin Dashboard v1.0</p>
          </div>
        )}
      </div>
    </div>
  );
}
