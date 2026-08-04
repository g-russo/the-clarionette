"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMainNavigationRoutes } from "@/app/config/routes";
import { Newspaper, Trophy, FileText, BookOpen, Flag, Users, Feather, CalendarDays, Info } from "lucide-react";

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
      'Opinions': Feather,
      'Events': CalendarDays,
      'About': Info,
      'Editorial Board': Users,
    };
    const IconComponent = icons[label] || FileText;
    return <IconComponent size={14} className="flex-shrink-0" />;
  };

  return (
    <nav className="flex items-center gap-0.5">
      {navigationRoutes.map((route) => (
        <Link
          key={route.path}
          href={route.path}
          className={`nav-link px-2 lg:px-2.5 py-1.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-1 lg:gap-1.5 whitespace-nowrap touch-manipulation min-h-[38px] text-sm ${
            isActive(route.path)
              ? "bg-red-600 text-white shadow-sm hover:bg-red-700"
              : "text-gray-700 hover:bg-red-50 hover:text-red-600"
          }`}
        >
          {getRouteIcon(route.label)}
          <span>{route.label}</span>
        </Link>
      ))}
    </nav>
  );
}
