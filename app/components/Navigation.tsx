"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMainNavigationRoutes } from "../config/routes";
import { Newspaper, Trophy, FileText, BookOpen, Flag, Users } from "lucide-react";

export default function Navigation() {
  const pathname = usePathname();
  const navigationRoutes = getMainNavigationRoutes();

  const isActive = (routePath: string) => {
    if (routePath === "/" && pathname === "/") return true;
    if (routePath !== "/" && pathname.startsWith(routePath)) return true;
    return false;
  };

  const getRouteIcon = (label: string) => {
    const icons: { [key: string]: any } = {
      'News': Newspaper,
      'Sports': Trophy,
      'Features': FileText,
      'Literary': BookOpen,
      'Filipino': Flag,
      'Editorial Board': Users
    };
    const IconComponent = icons[label] || FileText;
    return <IconComponent size={16} className="flex-shrink-0" />;
  };

  return (
    <nav className="flex items-center space-x-1">
      {navigationRoutes.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={`nav-link px-3 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
            isActive(route.path)
              ? "bg-red-600 text-white shadow-lg hover:bg-red-700"
              : "text-gray-800 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          {getRouteIcon(route.label)}
          <span className="text-sm">{route.label}</span>
        </Link>
      ))}
    </nav>
  );
}
