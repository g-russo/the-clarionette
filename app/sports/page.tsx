import Link from "next/link";
import PageLayout from "../components/PageLayout";

export default function SportsPage() {
    return (
        <PageLayout>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Sports</h1>
                    <p className="text-lg text-gray-600">Latest scores, highlights, and athletic achievements</p>
                </div>

                {/* Sports Categories */}
                <section className="mb-8">
                    <div className="flex flex-wrap gap-4">
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">[All Sports]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Basketball]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Volleyball]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Badminton]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Table tennis]</button>
                    </div>
                </section>

                {/* Sports Articles Grid */}
                <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }, (_, i) => (
                        <article key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-48 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">[Sports Image {i + 1}]</span>
                            </div>
                            <div className="p-6">
                                <span className="text-xs text-green-600 font-semibold">[SPORT]</span>
                                <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-3">[Sports Headline {i + 1}]</h3>
                                <p className="text-gray-600 text-sm mb-4">[Sports article excerpt]</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-gray-500">[Reporter] • [Time ago]</span>
                                    <Link href="#" className="text-green-600 hover:underline text-sm font-medium">Read</Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </PageLayout>
    );
}