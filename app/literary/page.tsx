import Link from "next/link";
import PageLayout from "../components/PageLayout";

export default function LiteraryPage() {
    return (
        <PageLayout>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Literary</h1>
                    <p className="text-lg text-gray-600">Creative writing, poetry, short stories, and literary criticism</p>
                </div>

                {/* Featured Literary Work */}
                <section className="mb-12">
                    <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8">
                        <span className="text-sm text-purple-600 font-semibold">[FEATURED WORK]</span>
                        <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">[Literary Work Title]</h2>
                        <p className="text-gray-700 mb-4 italic">[Excerpt or opening lines]</p>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">By [Author Name]</span>
                            <Link href="#" className="text-purple-600 hover:underline font-medium">Read Full Work</Link>
                        </div>
                    </div>
                </section>

                {/* Literary Categories */}
                <section className="mb-8">
                    <div className="flex flex-wrap gap-4">
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-colors">[All Works]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Poetry]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Short Stories]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Essays]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Reviews]</button>
                    </div>
                </section>

                {/* Literary Works Grid */}
                <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }, (_, i) => (
                        <article key={i} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-purple-500">
                            <span className="text-xs text-purple-600 font-semibold">[GENRE]</span>
                            <h3 className="text-lg font-bold text-gray-900 mt-2 mb-3">[Literary Work Title {i + 1}]</h3>
                            <p className="text-gray-600 text-sm mb-4 italic">[Excerpt or description]</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">By [Author Name]</span>
                                <Link href="#" className="text-purple-600 hover:underline text-sm font-medium">Read</Link>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </PageLayout>
    );
}