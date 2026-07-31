"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMainNavigationRoutes, DEFAULT_MAIN_ROUTE } from "@/app/config/routes";
import { Menu, X, Home, Newspaper, Trophy, FileText, BookOpen, Flag, Users, Mail, Phone, Feather, CalendarDays, Info } from "lucide-react";

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const pathname = usePathname();
  const navigationRoutes = getMainNavigationRoutes();

  // Handle client-side mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when menu is open and trigger animation
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setShouldRender(true);
      // Trigger slide-in animation after render
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = '';
      setIsAnimating(false);
      // Delay unmounting until animation completes
      const timeout = setTimeout(() => {
        setShouldRender(false);
      }, 300); // Match transition duration
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

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
    return <IconComponent size={22} className="flex-shrink-0" />;
  };

  return (
    <>
      {/* Mobile menu button - stays in header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2.5 md:p-3 rounded-lg text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-600 touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-expanded={isOpen}
        aria-label="Toggle navigation menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile menu overlay - rendered at body level via portal */}
      {mounted && shouldRender && typeof document !== 'undefined' && createPortal(
        <>
          {/* Semi-transparent backdrop overlay with blur */}
          <div 
            className={`fixed inset-0 backdrop-blur-sm z-[100] lg:hidden transition-all duration-300 ${
              isAnimating ? 'bg-black/40' : 'bg-black/0'
            }`}
            onClick={() => setIsOpen(false)}
            aria-label="Close menu overlay"
          />
          
          {/* Sliding menu panel from right */}
          <div className={`fixed top-0 right-0 bottom-0 w-4/5 sm:w-80 md:w-96 bg-white shadow-2xl overflow-y-auto z-[101] lg:hidden transition-transform duration-300 ease-in-out ${
            isAnimating ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="p-5 sm:p-6">
              <div className="flex justify-between items-center mb-6 sm:mb-8">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Navigation</h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2.5 rounded-lg text-gray-800 hover:bg-red-50 hover:text-red-600 transition-colors touch-manipulation min-h-[44px] min-w-[44px] flex items-center justify-center"
                  aria-label="Close navigation menu"
                >
                  <X size={20} />
                </button>
              </div>
              
              <nav className="space-y-1.5 sm:space-y-2">
                <Link
                  href={DEFAULT_MAIN_ROUTE}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 rounded-lg font-medium transition-all touch-manipulation text-base sm:text-lg min-h-[52px] ${
                    pathname === "/"
                      ? "bg-red-600 text-white shadow-md"
                      : "text-gray-800 hover:bg-red-50 hover:text-red-600"
                  }`}
                >
                  <Home size={22} className="flex-shrink-0" />
                  <span>Home</span>
                </Link>
                
                {navigationRoutes.map((route) => (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 rounded-lg font-medium transition-all touch-manipulation text-base sm:text-lg min-h-[52px] ${
                      isActive(route.path)
                        ? "bg-red-600 text-white shadow-md"
                        : "text-gray-800 hover:bg-red-50 hover:text-red-600"
                    }`}
                  >
                    {getRouteIcon(route.label)}
                    <span>{route.label}</span>
                  </Link>
                ))}
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  {/* Contact links can be added here */}
                </div>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}
