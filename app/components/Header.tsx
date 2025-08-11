"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Navigation from "./Navigation";
import MobileNavigation from "./MobileNavigation";
import { DEFAULT_MAIN_ROUTE } from "../config/routes";
import { Calendar, Clock, Mail, Phone, Home } from "lucide-react";

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
      alt="The Clarionette Logo"
      width={56}
      height={56}
      className="w-12 h-12 md:w-14 md:h-14 object-contain group-hover:scale-105 transition-transform shadow-lg rounded-lg"
      onError={handleImageError}
    />
  );
};

export default function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* Top Bar */}
      <div className="header-topbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <span className="text-gray-300 flex items-center gap-2">
                <Calendar size={14} />
                {currentTime.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
              <span className="text-gray-300 flex items-center gap-2">
                <Clock size={14} />
                {currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
            <div className="flex items-center space-x-6">
              {/* <a href="mailto:clarionette@mcs.edu.ph" className="text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2">
                <Mail size={14} />
                Submit Story
              </a> */}
              {/* <a href="#" className="text-gray-300 hover:text-red-400 transition-colors flex items-center gap-2">
                <Phone size={14} />
                Follow Us
              </a> */}
            </div>
          </div>
        </div>
      </div>      {/* Main Header */}
      <header className="header-main">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">            {/* Logo */}
            <Link href={DEFAULT_MAIN_ROUTE} className="flex items-center space-x-3 group">
              <LogoComponent />
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold text-gray-900 group-hover:text-red-600 transition-colors">
                  The Clarionette
                </h1>
                <p className="text-xs md:text-sm text-gray-600 font-medium hidden sm:block">
                  Malate Catholic School's Official Student Publication
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">              <Link
                href={DEFAULT_MAIN_ROUTE}
                className="nav-link text-gray-700 hover:bg-red-50 hover:text-red-600 flex items-center gap-2"
              >
                <Home size={16} />
                Home
              </Link>
              <Navigation />
            </div>

            {/* Mobile Navigation */}
            <div className="lg:hidden">
              <MobileNavigation />
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
