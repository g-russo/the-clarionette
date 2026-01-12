import Link from "next/link";

export default function FilipinoPage() {
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
                            <Link href="/main/filipino" className="text-red-600 dark:text-red-400 font-semibold">Filipino</Link>
                            <Link href="/main/editorial-board" className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">Editorial Board</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Filipino</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-300">Mga balita, sanaysay, at kwento sa wikang Filipino</p>
                </div>

                {/* Featured Filipino Content */}
                <section className="mb-12">
                    <div className="bg-gradient-to-r from-red-100 to-yellow-100 dark:from-red-900 dark:to-yellow-900 rounded-lg p-8">
                        <span className="text-sm text-red-600 dark:text-red-400 font-semibold">[TAMPOK NA ARTIKULO]</span>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 mb-4">[Pamagat ng Pangunahing Artikulo]</h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">[Buod ng artikulo o unang talata]</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">[Manunulat] • [Petsa]</span>
                            <Link href="#" className="text-red-600 dark:text-red-400 hover:underline">Basahin ang Buong Artikulo</Link>
                        </div>
                    </div>
                </section>

                {/* Filipino Content Categories */}
                <section className="mb-8">
                    <div className="flex flex-wrap gap-4">
                        <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium">[Lahat]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Balita]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Sanaysay]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Tula]</button>
                        <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">[Kultura]</button>
                    </div>
                </section>

                {/* Filipino Content Grid */}
                <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }, (_, i) => (
                        <article key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400">[Larawan {i + 1}]</span>
                            </div>
                            <div className="p-6">
                                <span className="text-xs text-red-600 dark:text-red-400 font-semibold">[KATEGORYA]</span>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-2 mb-3">[Pamagat ng Artikulo {i + 1}]</h3>
                                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">[Buod ng nilalaman]</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500 dark:text-gray-400">[Manunulat] • [Nakaraang oras]</span>
                                    <Link href="#" className="text-red-600 dark:text-red-400 hover:underline text-sm">Basahin</Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </div>
    );
}