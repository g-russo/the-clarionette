import Link from "next/link";
import PageLayout from "@/components/PageLayout";

export default function FeaturesPage() {
    return (
        <PageLayout>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Features</h1>
                    <p className="text-lg text-gray-600">In-depth stories, investigative reports, and human interest pieces</p>
                </div>

                {/* Featured Story */}
                <section className="mb-12">
                    <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-gray-500">[Featured Story Image]</span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                            <span className="text-sm text-yellow-400 font-semibold">[FEATURE]</span>
                            <h2 className="text-3xl font-bold text-white mt-2 mb-4">[Featured Story Headline]</h2>
                            <p className="text-gray-200 mb-4">[Feature story excerpt]</p>
                            <Link href="#" className="text-yellow-400 hover:underline font-medium">Read Full Feature</Link>
                        </div>
                    </div>
                </section>

                {/* Feature Categories */}
                <section className="mb-8">
                    <div className="flex flex-wrap gap-4">
                        <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-colors">[All Features]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Investigative]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Human Interest]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Profiles]</button>
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">[Culture]</button>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="grid md:grid-cols-2 gap-8">
                    {Array.from({ length: 6 }, (_, i) => (
                        <article key={i} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                            <div className="h-56 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500">[Feature Image {i + 1}]</span>
                            </div>
                            <div className="p-6">
                                <span className="text-xs text-yellow-600 font-semibold">[FEATURE TYPE]</span>
                                <h3 className="text-xl font-bold text-gray-900 mt-2 mb-3">[Feature Headline {i + 1}]</h3>
                                <p className="text-gray-600 mb-4">[Feature story excerpt and description]</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">[Author] • [Reading time] min read</span>
                                    <Link href="#" className="text-yellow-600 hover:underline font-medium">Read Story</Link>
                                </div>
                            </div>
                        </article>
                    ))}
                </section>
            </main>
        </PageLayout>
    );
}