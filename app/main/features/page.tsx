import Link from "next/link";

export default function FeaturesPage() {
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
                            <Link href="/main/features" className="text-blue-600 dark:text-blue-400 font-semibold">Features</Link>
                            <Link href="/main/sports" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Sports</Link>
                            <Link href="/main/literary" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Literary</Link>
                            <Link href="/main/filipino" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Filipino</Link>
                            <Link href="/main/editorial-board" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Editorial Board</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Features</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">In-depth stories, investigative reports, and human interest pieces</p>
                </div>

                {/* Featured Story */}
                <section className="mb-12">
                    <div className="relative h-96 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400">[Featured Story Image]</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                            <span className="text-sm text-yellow-400 font-semibold">[FEATURE]</span>
                            <h2 className="text-3xl font-bold text-white mt-2 mb-4">[Featured Story Headline]</h2>
                            <p className="text-gray-200 mb-4">[Feature story excerpt]</p>
                            <Link href="#" className="text-yellow-400 hover:underline">Read Full Feature</Link>
                        </div>
                    </div>
                </section>

                {/* Feature Categories */}
                <section className="mb-8">
                    <div className="flex flex-wrap gap-4">
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium">[All Features]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Investigative]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Human Interest]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Profiles]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Culture]</button>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="grid md:grid-cols-2 gap-8">
                    {Array.from({ length: 6 }, (_, i) => (
                        <article key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-56 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400">[Feature Image {i + 1}]</span>
                            </div>
                            <div className="p-6">
                                <span className="text-xs text-yellow-600 dark:text-yellow-400 font-semibold">[FEATURE TYPE]</span>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-2 mb-3">[Feature Headline {i + 1}]</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-4">[Feature story excerpt and description]</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">[Author] • [Reading time] min read</span>
                                    <Link href="#" className="text-yellow-600 dark:text-yellow-400 hover:underline">Read Story</Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
}