/**
 * API utility functions for fetching articles from Express backend
 */

import { API_CONFIG, API_ENDPOINTS } from './config';
import type { 
  Article, 
  ArticleListItem, 
  ArticlesResponse, 
  ArticleCategory,
  CreateArticleInput,
  UpdateArticleInput
} from '@/types';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}

/**
 * Get all articles with pagination and filtering
 */
export async function getArticles(params?: {
  page?: number;
  limit?: number;
  category?: ArticleCategory;
  status?: 'published' | 'draft';
  featured?: boolean;
}): Promise<ArticlesResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.category) queryParams.append('category', params.category);
  if (params?.status) queryParams.append('status', params.status);
  if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());

  const query = queryParams.toString();
  const endpoint = `${API_ENDPOINTS.ARTICLES}${query ? `?${query}` : ''}`;

  return fetchAPI<ArticlesResponse>(endpoint);
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(
  category: ArticleCategory,
  params?: { page?: number; limit?: number }
): Promise<ArticlesResponse> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  const query = queryParams.toString();
  const endpoint = `${API_ENDPOINTS.ARTICLES_BY_CATEGORY(category)}${query ? `?${query}` : ''}`;

  return fetchAPI<ArticlesResponse>(endpoint);
}

/**
 * Get a single article by slug
 */
export async function getArticleBySlug(slug: string): Promise<Article> {
  return fetchAPI<Article>(API_ENDPOINTS.ARTICLE_BY_SLUG(slug));
}

/**
 * Get featured articles
 */
export async function getFeaturedArticles(limit = 4): Promise<ArticleListItem[]> {
  const endpoint = `${API_ENDPOINTS.FEATURED_ARTICLES}?limit=${limit}`;
  return fetchAPI<ArticleListItem[]>(endpoint);
}

/**
 * Create a new article (requires authentication)
 */
export async function createArticle(
  data: CreateArticleInput,
  token: string
): Promise<Article> {
  return fetchAPI<Article>(API_ENDPOINTS.ARTICLES, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

/**
 * Update an existing article (requires authentication)
 */
export async function updateArticle(
  id: string,
  data: UpdateArticleInput,
  token: string
): Promise<Article> {
  return fetchAPI<Article>(`${API_ENDPOINTS.ARTICLES}/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
}

/**
 * Delete an article (requires authentication)
 */
export async function deleteArticle(id: string, token: string): Promise<void> {
  return fetchAPI<void>(`${API_ENDPOINTS.ARTICLES}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

/**
 * Search articles
 */
export async function searchArticles(query: string, params?: {
  page?: number;
  limit?: number;
}): Promise<ArticlesResponse> {
  const queryParams = new URLSearchParams({ q: query });
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.limit) queryParams.append('limit', params.limit.toString());

  return fetchAPI<ArticlesResponse>(`${API_ENDPOINTS.ARTICLES}/search?${queryParams.toString()}`);
}
