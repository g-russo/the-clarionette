import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export default function NewsPage() {
    return (
        <PageLayout>
            {/* BODY SECTION - News Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">News</h1>
                    <p className="text-lg text-gray-600">Stay informed with the latest breaking news and current events</p>
                </div>

                {/* Featured News */}
                <section className="mb-12">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="md:flex">
                            <div className="md:w-1/2">
                                <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-500">[Featured News Image]</span>
                                </div>
                            </div>
                            <div className="md:w-1/2 p-8">
                                <span className="text-sm text-red-600 font-semibold">[BREAKING]</span>
                                <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-4">[Featured Headline]</h2>
                                <p className="text-gray-600 mb-4">[Featured Article Excerpt]</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">[Timestamp]</span>
                                    <Link href="#" className="text-blue-600 hover:underline font-medium">Read More</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* News Categories */}
                <section className="mb-8">
                    <div className="flex flex-wrap gap-4">
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">[All News]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Politics]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Local]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[International]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Business]</button>
                    </div>
                </section>

                {/* News Grid */}
                <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }, (_, i) => (
                        <article key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">[Article Image {i + 1}]</span>
                            </div>
                            <div className="p-6">
                                <span className="text-xs text-blue-600 font-semibold">[CATEGORY]</span>
                                <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-3">[Article Headline {i + 1}]</h3>
                                <p className="text-gray-600 text-sm mb-4">[Article excerpt or summary]</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">[Author] • [Time ago]</span>
                                    <Link href="#" className="text-blue-600 hover:underline text-sm font-medium">Read</Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>

                {/* Load More */}
                <div className="text-center mt-12">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                        [Load More Articles]
                    </button>
                </div>
            </main>
        </PageLayout>
    );
}