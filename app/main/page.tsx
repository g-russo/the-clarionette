import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/main" className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white cursor-pointer">
                  The Clarionette
                </h1>
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/main/news" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">News</Link>
              <Link href="/main/features" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Features</Link>
              <Link href="/main/sports" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Sports</Link>
              <Link href="/main/literary" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Literary</Link>
              <Link href="/main/filipino" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Filipino</Link>
              <Link href="/main/editorial-board" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Editorial Board</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="mb-12">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="relative h-64 lg:h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">Featured Image</span>
              </div>
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Breaking: Major Development Shakes Global Markets
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                In a surprising turn of events, financial markets worldwide are responding to unprecedented
                policy changes that could reshape the economic landscape for years to come.
              </p>
              <a href="#" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                Read Full Story
              </a>
            </div>
          </div>
        </section>

        {/* Latest News Grid */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Latest News</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* News Article 1 */}
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">News Image</span>
              </div>
              <div className="p-6">
                <span className="text-sm text-blue-600 dark:text-blue-400 font-semibold">POLITICS</span>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-2 mb-3">
                  Government Announces New Infrastructure Plan
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  The administration unveiled a comprehensive infrastructure package aimed at modernizing transportation networks.
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</span>
              </div>
            </article>

            {/* News Article 2 */}
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">News Image</span>
              </div>
              <div className="p-6">
                <span className="text-sm text-green-600 dark:text-green-400 font-semibold">TECHNOLOGY</span>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-2 mb-3">
                  Tech Giants Report Record Quarterly Earnings
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Major technology companies exceeded analyst expectations with strong performance across all sectors.
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</span>
              </div>
            </article>

            {/* News Article 3 */}
            <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">News Image</span>
              </div>
              <div className="p-6">
                <span className="text-sm text-red-600 dark:text-red-400 font-semibold">SPORTS</span>
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white mt-2 mb-3">
                  Championship Finals Set for This Weekend
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Two powerhouse teams will face off in what promises to be the most exciting finale in recent history.
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400">6 hours ago</span>
              </div>
            </article>
          </div>
        </section>

        {/* Trending Topics */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Trending Topics</h3>
          <div className="flex flex-wrap gap-3">
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
              #GlobalMarkets
            </span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
              #ClimateChange
            </span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
              #TechInnovation
            </span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
              #Elections2024
            </span>
            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 cursor-pointer">
              #Healthcare
            </span>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">The Clarionette</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Your trusted source for breaking news, in-depth analysis, and comprehensive coverage of global events.
              </p>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Sections</h5>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Politics</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Business</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Technology</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Sports</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Company</h5>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-gray-900 dark:hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 dark:text-white mb-3">Follow Us</h5>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              © 2025 The Clarionette. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}