/**
 * EXAMPLE: How to use the new API structure in your pages
 * This shows practical examples of fetching and displaying data
 */

// =============================================================================
// EXAMPLE 1: News Page with Server-Side Data Fetching
// =============================================================================

import { getArticlesByCategory } from '@/lib/api';
import PageLayout from '@/components/PageLayout';
import type { ArticleListItem } from '@/types';
import Link from 'next/link';

export default async function NewsPage() {
  // Fetch articles from your Express API
  try {
    const { articles, total, totalPages } = await getArticlesByCategory('news', {
      page: 1,
      limit: 10
    });

    return (
      <PageLayout>
        <main className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">News</h1>
          
          <div className="grid md:grid-cols-3 gap-6">
            {articles.map((article: ArticleListItem) => (
              <article key={article._id} className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    By {article.author.name}
                  </span>
                  <Link 
                    href={`/news/${article.slug}`}
                    className="text-red-600 font-semibold hover:underline"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Showing {articles.length} of {total} articles
            </p>
          </div>
        </main>
      </PageLayout>
    );
    
  } catch (error) {
    // Fallback when API is not available yet
    console.error('Failed to fetch articles:', error);
    
    return (
      <PageLayout>
        <main className="max-w-7xl mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-8">News</h1>
          <p className="text-gray-600">
            Articles will appear here once your backend is connected.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Make sure your Express API is running on {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}
          </p>
        </main>
      </PageLayout>
    );
  }
}

// =============================================================================
// EXAMPLE 2: Single Article Page with Dynamic Route
// =============================================================================

import { getArticleBySlug } from '@/lib/api';
import type { Article } from '@/types';
import { Calendar, User, Clock } from 'lucide-react';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  try {
    const article: Article = await getArticleBySlug(params.slug);

    return (
      <PageLayout>
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Article Header */}
          <header className="mb-8">
            <span className="inline-block px-3 py-1 bg-red-600 text-white rounded-full text-sm font-semibold mb-4">
              {article.category.toUpperCase()}
            </span>
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            
            <div className="flex items-center gap-6 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <User size={16} />
                <span>{article.author.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{article.readTime} min read</span>
              </div>
            </div>
          </header>

          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Article Tags */}
          {article.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </PageLayout>
    );

  } catch (error) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600">The article you're looking for doesn't exist.</p>
          <Link href="/news" className="text-red-600 hover:underline mt-4 inline-block">
            Back to News
          </Link>
        </div>
      </PageLayout>
    );
  }
}

// =============================================================================
// EXAMPLE 3: Homepage with Featured Articles
// =============================================================================

import { getFeaturedArticles } from '@/lib/api';
import MainContent from '@/components/MainContent';

export default async function HomePage() {
  try {
    const featuredArticles = await getFeaturedArticles(4);

    // You can pass the fetched articles as props to MainContent
    // or create a new component that uses them
    
    return (
      <PageLayout>
        <MainContent />
        
        {/* Or create a custom section with real data */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-8">Featured Stories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredArticles.map((article) => (
              <Link
                key={article._id}
                href={`/${article.category}/${article.slug}`}
                className="group"
              >
                <article className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                  <div className="p-6">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-red-600 transition">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      </PageLayout>
    );

  } catch (error) {
    // Fallback to static content when API isn't available
    return (
      <PageLayout>
        <MainContent />
      </PageLayout>
    );
  }
}

// =============================================================================
// EXAMPLE 4: Client Component with Form Submission
// =============================================================================

'use client';

import { useState } from 'react';
import { createArticle } from '@/lib/api';
import type { CreateArticleInput, Article } from '@/types';

export default function CreateArticleForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    const articleData: CreateArticleInput = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      excerpt: formData.get('excerpt') as string,
      category: formData.get('category') as any,
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()),
      featured: formData.get('featured') === 'on',
      status: 'draft',
    };

    try {
      // Get token from localStorage (set during login)
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        throw new Error('Please login first');
      }

      const newArticle: Article = await createArticle(articleData, token);
      
      setSuccess(true);
      console.log('Article created:', newArticle);
      
      // Reset form
      e.currentTarget.reset();

    } catch (err: any) {
      setError(err.message || 'Failed to create article');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <div>
        <label className="block text-sm font-semibold mb-2">Title</label>
        <input
          type="text"
          name="title"
          required
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Excerpt</label>
        <textarea
          name="excerpt"
          required
          rows={3}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Content</label>
        <textarea
          name="content"
          required
          rows={10}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Category</label>
        <select name="category" required className="w-full px-4 py-2 border rounded-lg">
          <option value="news">News</option>
          <option value="features">Features</option>
          <option value="sports">Sports</option>
          <option value="literary">Literary</option>
          <option value="filipino">Filipino</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold mb-2">Tags (comma-separated)</label>
        <input
          type="text"
          name="tags"
          placeholder="school, events, announcement"
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="flex items-center">
        <input type="checkbox" name="featured" id="featured" className="mr-2" />
        <label htmlFor="featured" className="text-sm">Mark as featured</label>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-600">
          Article created successfully!
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Create Article'}
      </button>
    </form>
  );
}

// =============================================================================
// EXAMPLE 5: Editorial Board Page with Authors
// =============================================================================

import { getAuthors } from '@/lib/api';
import type { User } from '@/types';
import { Mail, Linkedin, Twitter } from 'lucide-react';

export default async function EditorialBoardPage() {
  try {
    const authors: User[] = await getAuthors();

    return (
      <PageLayout>
        <main className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Editorial Board</h1>
            <p className="text-lg text-gray-600">
              Meet the team behind The Beacon
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors.map((author) => (
              <div key={author._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  {author.avatar ? (
                    <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-6xl text-white">
                      {author.name.charAt(0)}
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{author.name}</h3>
                  <p className="text-red-600 font-semibold mb-3">{author.position}</p>
                  {author.bio && (
                    <p className="text-gray-600 text-sm mb-4">{author.bio}</p>
                  )}

                  <div className="flex items-center gap-3 pt-4 border-t">
                    <a href={`mailto:${author.email}`} className="text-gray-400 hover:text-red-600">
                      <Mail size={20} />
                    </a>
                    {author.social?.twitter && (
                      <a href={author.social.twitter} className="text-gray-400 hover:text-red-600">
                        <Twitter size={20} />
                      </a>
                    )}
                    {author.social?.linkedin && (
                      <a href={author.social.linkedin} className="text-gray-400 hover:text-red-600">
                        <Linkedin size={20} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </PageLayout>
    );

  } catch (error) {
    // Fallback to static data when API isn't available
    return <EditorialBoardPageStatic />;
  }
}
