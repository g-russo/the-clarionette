import Link from "next/link";

export default function LiteraryPage() {
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
                            <Link href="/main/literary" className="text-purple-600 dark:text-purple-400 font-semibold">Literary</Link>
                            <Link href="/main/filipino" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Filipino</Link>
                            <Link href="/main/editorial-board" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Editorial Board</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Literary</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">Creative writing, poetry, short stories, and literary criticism</p>
                </div>

                {/* Featured Literary Work */}
                <section className="mb-12">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 rounded-lg p-8">
                        <span className="text-sm text-purple-600 dark:text-purple-400 font-semibold">[FEATURED WORK]</span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">[Literary Work Title]</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4 italic">[Excerpt or opening lines]</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">By [Author Name]</span>
                            <Link href="#" className="text-purple-600 dark:text-purple-400 hover:underline">Read Full Work</Link>
                        </div>
                    </div>
                </section>

                {/* Literary Categories */}
                <section className="mb-8">
                    <div className="flex flex-wrap gap-4">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium">[All Works]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Poetry]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Short Stories]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Essays]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Reviews]</button>
                    </div>
                </section>

                {/* Literary Works Grid */}
                <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }, (_, i) => (
                        <article key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
                            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">[GENRE]</span>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-2 mb-3">[Literary Work Title {i + 1}]</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 italic">[Excerpt or description]</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500 dark:text-gray-400">By [Author Name]</span>
                                <Link href="#" className="text-purple-600 dark:text-purple-400 hover:underline text-sm">Read</Link>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
}