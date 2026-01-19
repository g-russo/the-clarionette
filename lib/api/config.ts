/**
 * API Configuration
 * Set your Express backend URL here
 */

export const API_CONFIG = {
  // Development
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  
  // Production - replace with your actual backend URL
  // BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://your-backend.com/api',
  
  TIMEOUT: 10000, // 10 seconds
};

export const API_ENDPOINTS = {
  // Articles
  ARTICLES: '/articles',
  ARTICLE_BY_SLUG: (slug: string) => `/articles/${slug}`,
  ARTICLES_BY_CATEGORY: (category: string) => `/articles/category/${category}`,
  FEATURED_ARTICLES: '/articles/featured',
  
  // Users/Authors
  AUTHORS: '/authors',
  AUTHOR_BY_ID: (id: string) => `/authors/${id}`,
  
  // Auth
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  ME: '/auth/me',
};
