"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";
import MobileNavigation from "@/components/MobileNavigation";
import { DEFAULT_MAIN_ROUTE } from "@/app/config/routes";
import { Calendar, Clock, Home, Search, X } from "lucide-react";

// Logo component that handles image fallback
const LogoComponent = () => {
  const [logoError, setLogoError] = useState(false);

  const handleImageError = () => {
    console.log("Logo failed to load, showing text fallback");
    setLogoError(true);
  };

  // If logo failed to load, show text logo
  if (logoError) {
    return (
      <div className="w-12 h-12 md:w-14 md:h-14 group-hover:scale-105 transition-transform shadow-lg bg-red-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">
        C
      </div>
    );
  }

  return (
    <img
      src="/images/logos/logo-main.webp"
      alt="The Beacon Logo"
      width={56}
      height={56}
      className="w-12 h-12 md:w-14 md:h-14 object-contain group-hover:scale-105 transition-transform shadow-lg rounded-lg"
      onError={handleImageError}
    />
  );
};

export default function Header() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Auto-focus input when search bar opens
  useEffect(() => {
    if (showSearch) inputRef.current?.focus();
  }, [showSearch]);

  function handleSearchSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    setShowSearch(false);
    setSearchQuery("");
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { setShowSearch(false); setSearchQuery(""); }
  }

  return (
    <>
      {/* Top Bar */}
      <div className="header-topbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-xs sm:text-sm py-0.5">
            <div className="flex items-center gap-3 sm:gap-6">
              {/* Short date on mobile, full date on sm+ */}
              <span className="text-gray-300 flex items-center gap-1.5">
                <Calendar size={13} />
                <span className="sm:hidden">
                  {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="hidden sm:inline">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </span>
              <span className="text-gray-300 flex items-center gap-1.5">
                <Clock size={13} />
                {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="header-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4 md:py-5">
            {/* Logo */}
            <Link href={DEFAULT_MAIN_ROUTE} className="flex items-center gap-2 sm:gap-3 group min-w-0">
              <LogoComponent />
              <div className="min-w-0">
                <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors leading-tight">
                  The Beacon
                </h1>
                <p className="text-xs text-gray-600 font-medium hidden sm:block truncate">
                  Harrow Hill High School's Official Student Publication
                </p>
              </div>
            </Link>

            {/* Right side actions */}
            <div className="flex items-center gap-1 flex-shrink-0 ml-3">
              {/* Search toggle */}
              <button
                onClick={() => { setShowSearch((v) => !v); setSearchQuery(""); }}
                className="p-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                aria-label="Search"
              >
                {showSearch ? <X size={20} /> : <Search size={20} />}
              </button>

              {/* Mobile/Tablet hamburger (hidden on lg+) */}
              <div className="lg:hidden">
                <MobileNavigation />
              </div>
            </div>
          </div>

          {/* Expandable search bar */}
          {showSearch && (
            <div className="pb-4">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search articles, topics, authors…"
                  className="w-full pl-11 pr-24 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Desktop Nav strip — centered, shown only on lg+ */}
        <div className="hidden lg:block border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center flex-wrap gap-0.5 py-1">
              <Link
                href={DEFAULT_MAIN_ROUTE}
                className="nav-link px-2.5 py-1.5 rounded-lg font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-1.5 whitespace-nowrap transition-all text-sm min-h-[38px]"
              >
                <Home size={14} className="flex-shrink-0" />
                <span>Home</span>
              </Link>
              <Navigation />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
