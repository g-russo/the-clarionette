"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMainNavigationRoutes } from "../config/routes";
import { 
  Mail, 
  Phone, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube, 
  Home, 
  Newspaper, 
  Trophy, 
  FileText, 
  BookOpen, 
  Flag, 
  Users,
  School,
  Book
} from "lucide-react";
import React, { useState, useEffect } from "react";

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

export default function Footer() {
  const navigationRoutes = getMainNavigationRoutes();
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const footerSections = {
    publication: [
      { label: "About The Clarionette", href: "/editorial-board" },
      { label: "Editorial Board", href: "/editorial-board" },
      { label: "Contact Us", href: "mailto:clarionette@mcs.edu.ph" },
      { label: "Submit a Story", href: "#" },
      { label: "Archives", href: "#" }
    ],
    school: [
      { label: "Malate Catholic School", href: "mcs1917@mcsmanila.edu.ph" },
      { label: "Admissions", href: "#" },
      { label: "Academic Programs", href: "#" },
      { label: "School Calendar", href: "#" },
      { label: "Student Life", href: "#" }
    ],
    resources: [
      { label: "Writing Guidelines", href: "#" },
      { label: "Publication Schedule", href: "#" },
      { label: "Media Kit", href: "#" },
      { label: "Advertisement", href: "#" },
      { label: "Newsletter", href: "#" }
    ]
  };
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="footer-brand">
              <div className="footer-logo">
                <LogoComponent />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-gray-900">The Clarionette</h3>
                <p className="text-sm text-red-600 font-semibold">Student Publication</p>
              </div>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed text-base">
              Malate Catholic School's official student publication, dedicated to informing, 
              inspiring, and connecting our school community through quality journalism and storytelling.
            </p>
            <div className="flex space-x-3 mb-8">
              <a href="#" className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110">
                <Youtube size={20} />
              </a>
            </div>            
            <div className="text-sm text-gray-600 space-y-3">
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-red-600" />
                mcs.clarionette@mcsmanila.edu.ph
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-red-600" />
                (02) 8525 3921
              </p>
            </div>
          </div>          
          {/* Sections Navigation */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <Newspaper size={18} className="flex-shrink-0 text-red-600" />
              <span>Sections</span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-600 hover:text-red-600 flex items-center gap-2 hover:translate-x-1 transition-all text-sm">
                  <Home size={16} className="flex-shrink-0" />
                  <span>Home</span>
                </Link>
              </li>
              {navigationRoutes.map((route, index) => (
                <li key={index}>
                  <Link href={route.path} className="text-gray-600 hover:text-red-600 flex items-center gap-2 hover:translate-x-1 transition-all text-sm">
                    {route.label === 'News' ? <Newspaper size={16} className="flex-shrink-0" /> :
                     route.label === 'Sports' ? <Trophy size={16} className="flex-shrink-0" /> :
                     route.label === 'Features' ? <FileText size={16} className="flex-shrink-0" /> :
                     route.label === 'Literary' ? <BookOpen size={16} className="flex-shrink-0" /> :
                     route.label === 'Filipino' ? <Flag size={16} className="flex-shrink-0" /> :
                     route.label === 'Editorial Board' ? <Users size={16} className="flex-shrink-0" /> : <FileText size={16} className="flex-shrink-0" />}
                    <span>{route.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Publication Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <Book size={18} className="flex-shrink-0 text-red-600" />
              <span>Publication</span>
            </h4>
            <ul className="space-y-3">
              {footerSections.publication.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-red-600 hover:translate-x-1 transition-all text-sm flex items-start"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* School Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-gray-900 flex items-center gap-2">
              <School size={18} className="flex-shrink-0 text-red-600" />
              <span>School</span>
            </h4>
            <ul className="space-y-3">
              {footerSections.school.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-red-600 hover:translate-x-1 transition-all text-sm flex items-start"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      {!isHomePage && (
        <div className="bg-red-600 border-t border-red-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2">
                <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                  <Mail size={20} />
                  Stay Updated
                </h4>
                <p className="text-red-50 text-sm">
                  Subscribe to our newsletter for the latest news and updates from The Clarionette.
                </p>
              </div>
              <div className="mt-4 md:mt-0 md:w-1/2">
                <div className="flex max-w-md md:ml-auto">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-white placeholder:text-gray-500"
                  />
                  <button className="bg-gray-900 text-white px-6 py-3 rounded-r-lg font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-white">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className="bg-gray-100 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-700">
                © {currentYear} The Clarionette - Malate Catholic School. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Designed with ❤️ by MCS Students
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
              <Link href="#" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                Sitemap
              </Link>
              <Link href="#" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
