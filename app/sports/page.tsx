import Link from "next/link";

export default function SportsPage() {
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
                            <Link href="/main/sports" className="text-green-600 dark:text-green-400 font-semibold">Sports</Link>
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
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Sports</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">Latest scores, highlights, and athletic achievements</p>
                </div>

                {/* Live Scores Banner */}
                <section className="mb-8">
                    <div className="bg-green-600 text-white rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">[Live Scores]</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-green-700 rounded p-4 text-center">
                                <div className="text-sm">[Team A] vs [Team B]</div>
                                <div className="text-2xl font-bold">[Score A] - [Score B]</div>
                                <div className="text-sm">[Status/Time]</div>
                            </div>
                            <div className="bg-green-700 rounded p-4 text-center">
                                <div className="text-sm">[Team C] vs [Team D]</div>
                                <div className="text-2xl font-bold">[Score C] - [Score D]</div>
                                <div className="text-sm">[Status/Time]</div>
                            </div>
                            <div className="bg-green-700 rounded p-4 text-center">
                                <div className="text-sm">[Team E] vs [Team F]</div>
                                <div className="text-2xl font-bold">[Score E] - [Score F]</div>
                                <div className="text-sm">[Status/Time]</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Sports Categories */}
                <section className="mb-8">
                    <div className="flex flex-wrap gap-4">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium">[All Sports]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Basketball]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Football]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Baseball]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Track & Field]</button>
                    </div>
                </section>

                {/* Sports Articles Grid */}
                <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }, (_, i) => (
                        <article key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400">[Sports Image {i + 1}]</span>
                            </div>
                            <div className="p-6">
                                <span className="text-xs text-green-600 dark:text-green-400 font-semibold">[SPORT]</span>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2 mb-3">[Sports Headline {i + 1}]</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">[Sports article excerpt]</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">[Reporter] • [Time ago]</span>
                                    <Link href="#" className="text-green-600 dark:text-green-400 hover:underline text-sm">Read</Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
}