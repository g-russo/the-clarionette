import Link from "next/link";
import PageLayout from "../../components/PageLayout";

export default function EditorialBoardPage() {
    return (
        <PageLayout>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Editorial Board</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">Meet the team behind The Clarionette</p>
                </div>

                {/* Editorial Board Content */}
                <div className="space-y-8">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">Our Editorial Team</h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            The Clarionette is managed by a dedicated team of student journalists and editors 
                            committed to delivering quality news and content to the Malate Catholic School community.
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Placeholder for editorial board members */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">Editor-in-Chief</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-center">Name</p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">News Editor</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-center">Name</p>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                            <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">Sports Editor</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-center">Name</p>
                        </div>
                    </div>
                </div>            </main>
        </PageLayout>
    );
}
