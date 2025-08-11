import Link from "next/link";
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

export default function Footer() {
  const navigationRoutes = getMainNavigationRoutes();
  const currentYear = new Date().getFullYear();

  const footerSections = {
    publication: [
      { label: "About The Clarionette", href: "/main/editorial-board" },
      { label: "Editorial Board", href: "/main/editorial-board" },
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
    <footer className="footer">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="footer-brand">
              <div className="footer-logo">
                C
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold">The Clarionette</h3>
                <p className="text-sm text-gray-400">Student Publication</p>
              </div>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed text-lg">
              Malate Catholic School's official student publication, dedicated to informing, 
              inspiring, and connecting our school community through quality journalism and storytelling.
            </p>
            <div className="flex space-x-3 mb-8">
              <a href="#" className="social-link">
                <Facebook size={20} />
              </a>
              <a href="#" className="social-link">
                <Twitter size={20} />
              </a>
              <a href="#" className="social-link">
                <Instagram size={20} />
              </a>
              <a href="#" className="social-link">
                <Youtube size={20} />
              </a>
            </div>            
            <div className="text-sm text-gray-400 space-y-3">
              <p className="flex items-center gap-2">
                <Mail size={16} />
                mcs.clarionette@mcsmanila.edu.ph
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} />
                (02) 8525 3921
              </p>
            </div>
          </div>          {/* Sections Navigation */}
          <div className="footer-section">
            <h3>Sections</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/main" className="footer-link flex items-center gap-2">
                  <Home size={16} />
                  Home
                </Link>
              </li>
              {navigationRoutes.map((route, index) => (
                <li key={index}>
                  <Link href={route.path} className="footer-link flex items-center gap-2">
                    {route.label === 'News' ? <Newspaper size={16} /> :
                     route.label === 'Sports' ? <Trophy size={16} /> :
                     route.label === 'Features' ? <FileText size={16} /> :
                     route.label === 'Literary' ? <BookOpen size={16} /> :
                     route.label === 'Filipino' ? <Flag size={16} /> :
                     route.label === 'Editorial Board' ? <Users size={16} /> : <FileText size={16} />}
                    {route.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Publication Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white flex items-center">
              <Book size={16} className="mr-2" />
              Publication
            </h4>
            <ul className="space-y-3">
              {footerSections.publication.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* School Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-white flex items-center">
              <School size={16} className="mr-2" />
              School

            </h4>
            <ul className="space-y-3">
              {footerSections.school.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors text-sm"
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
      <div className="bg-gray-800 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h4 className="text-lg font-bold text-white mb-2">📬 Stay Updated</h4>
              <p className="text-gray-300 text-sm">
                Subscribe to our newsletter for the latest news and updates from The Clarionette.
              </p>
            </div>
            <div className="mt-4 md:mt-0 md:w-1/2">
              <div className="flex max-w-md ml-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-600"
                />
                <button className="bg-red-600 px-6 py-2 rounded-r-lg font-semibold hover:bg-red-700 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-sm text-gray-400">
                © {currentYear} The Clarionette - Malate Catholic School. All rights reserved.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Designed with ❤️ by MCS Students
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex justify-center md:justify-end space-x-6">
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
