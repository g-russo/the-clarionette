"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMainNavigationRoutes, DEFAULT_MAIN_ROUTE } from "../config/routes";
import { Menu, X, Home, Newspaper, Trophy, FileText, BookOpen, Flag, Users, Mail, Phone } from "lucide-react";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const navigationRoutes = getMainNavigationRoutes();

  const isActive = (routePath: string) => {
    if (routePath === "/main" && pathname === "/main") return true;
    if (routePath !== "/main" && pathname.startsWith(routePath)) return true;
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
    return <IconComponent size={20} />;
  };

  return (
    <div className="relative">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}></div>          <div className="fixed top-0 right-0 w-80 h-full bg-white shadow-xl">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-gray-900">Navigation</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <nav className="space-y-2">
                <Link
                  href={DEFAULT_MAIN_ROUTE}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    pathname === "/main"
                      ? "bg-red-600 text-white"
                      : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  <Home size={20} />
                  <span>Home</span>
                </Link>
                
                {navigationRoutes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all ${
                      isActive(route.path)
                        ? "bg-red-600 text-white"
                        : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    {getRouteIcon(route.label)}
                    <span>{route.label}</span>
                  </Link>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  {/* <a href="mailto:clarionette@mcs.edu.ph" className="flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors">
                    <Mail size={20} />
                    <span>Submit Story</span>
                  </a>
                  <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-red-600 transition-colors">
                    <Phone size={20} />
                    <span>Follow Us</span>
                  </a> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
