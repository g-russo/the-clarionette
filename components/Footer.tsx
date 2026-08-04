"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMainNavigationRoutes } from "@/app/config/routes";
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
  Book,
  Feather,
  CalendarDays,
  Info,
} from "lucide-react";
import React, { useState } from "react";
import { useSiteConfig } from "@/lib/hooks/useSiteConfig";

function TikTokIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.9a8.22 8.22 0 004.8 1.53V7a4.85 4.85 0 01-1.03-.31z" />
    </svg>
  );
}

const LogoComponent = () => {
  const [logoError, setLogoError] = useState(false);
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
      onError={() => setLogoError(true)}
    />
  );
};

export default function Footer() {
  const config = useSiteConfig();
  const navigationRoutes = getMainNavigationRoutes();
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const socialLinks = [
    { url: config.facebook,  Icon: Facebook,  label: "Facebook"  },
    { url: config.twitter,   Icon: Twitter,   label: "Twitter"   },
    { url: config.instagram, Icon: Instagram, label: "Instagram" },
    { url: config.youtube,   Icon: Youtube,   label: "YouTube"   },
    { url: config.tiktok,    Icon: null,      label: "TikTok"    },
  ].filter((s) => s.url);

  const footerSections = {
    publication: [
      { label: "About The Beacon", href: "/about" },
      { label: "Editorial Board",        href: "/editorial-board" },
      { label: "Contact Us",             href: `mailto:${config.email}` },
      { label: "Submit a Story",         href: "/submit" },
      { label: "Archives",               href: "/news" },
    ],
    school: [
      { label: "Harrow Hill High School", href: "https://www.harrowhill.edu" },
      { label: "Admissions",             href: "https://www.harrowhill.edu" },
      { label: "Academic Programs",      href: "https://www.harrowhill.edu" },
      { label: "School Calendar",        href: "https://www.harrowhill.edu" },
      { label: "Student Life",           href: "https://www.harrowhill.edu" },
    ],
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
                <h3 className="font-display text-2xl font-bold text-gray-900">{config.name}</h3>
                <p className="text-sm text-red-600 font-semibold">Student Publication</p>
              </div>
            </div>
            <p className="text-gray-600 mb-8 leading-relaxed text-base">
              {config.description}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex space-x-3 mb-8">
                {socialLinks.map(({ url, Icon, label }) => (
                  <a
                    key={label}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center text-white transition-all hover:scale-110"
                  >
                    {Icon ? <Icon size={20} /> : <TikTokIcon size={20} />}
                  </a>
                ))}
              </div>
            )}
            <div className="text-sm text-gray-600 space-y-3">
              {config.email && (
                <p className="flex items-center gap-2">
                  <Mail size={16} className="text-red-600" />
                  {config.email}
                </p>
              )}
              {config.phone && (
                <p className="flex items-center gap-2">
                  <Phone size={16} className="text-red-600" />
                  {config.phone}
                </p>
              )}
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
                     route.label === 'Opinions' ? <Feather size={16} className="flex-shrink-0" /> :
                     route.label === 'Events' ? <CalendarDays size={16} className="flex-shrink-0" /> :
                     route.label === 'About' ? <Info size={16} className="flex-shrink-0" /> :
                     route.label === 'Editorial Board' ? <Users size={16} className="flex-shrink-0" /> :
                     <FileText size={16} className="flex-shrink-0" />}
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
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-600 hover:text-red-600 hover:translate-x-1 transition-all text-sm flex items-start"
                  >
                    {link.label}
                  </a>
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
                  Subscribe to our newsletter for the latest news and updates from {config.name}.
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
                © {currentYear} {config.name} - {config.school}. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Developed by Russ Garcia
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
              <Link href="/privacy-policy" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                Sitemap
              </Link>
              <Link href="/accessibility" className="text-sm text-gray-600 hover:text-red-600 transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
