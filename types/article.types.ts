/**
 * Article types for MongoDB + Express backend
 * These interfaces should match your MongoDB schemas
 */

export type ArticleCategory = 'news' | 'features' | 'sports' | 'literary' | 'filipino';

export type ArticleStatus = 'draft' | 'published' | 'archived';

export interface Author {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  status: ArticleStatus;
  featured: boolean;
  author: Author;
  coverImage?: string;
  tags: string[];
  readTime: number; // in minutes
  views: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  publishedAt?: string; // ISO date string
}

export interface ArticleListItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: ArticleCategory;
  author: {
    _id: string;
    name: string;
    avatar?: string;
  };
  coverImage?: string;
  readTime: number;
  createdAt: string;
  publishedAt?: string;
}

export interface ArticlesResponse {
  articles: ArticleListItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateArticleInput {
  title: string;
  content: string;
  excerpt: string;
  category: ArticleCategory;
  tags?: string[];
  coverImage?: string;
  featured?: boolean;
  status?: ArticleStatus;
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {
  slug?: string;
}
