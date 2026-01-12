"use client";

import { useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Auth context will handle redirect
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <AdminSidebar isCollapsed={sidebarCollapsed} />
      
      <div className="flex-1 flex flex-col">
        <AdminHeader onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
        
        <main className="flex-1 p-6">
          {title && (
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}
