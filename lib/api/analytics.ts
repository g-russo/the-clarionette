import { API_CONFIG, API_ENDPOINTS } from './config';

async function fetchAPI<T>(endpoint: string, token: string): Promise<T> {
  const res = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { message?: string }).message ?? `API Error: ${res.status}`);
  }
  return res.json();
}

export interface WorkflowCount { status: string; count: number }

export interface AnalyticsOverview {
  totalArticles:    number;
  publishedCount:   number;
  draftCount:       number;
  inReviewCount:    number;
  scheduledCount:   number;
  totalViews:       number;
  newThisWeek:      number;
  newThisMonth:     number;
  avgReadTime:      number;
  workflowBreakdown: WorkflowCount[];
  mostViewed: {
    _id: string; title: string; slug: string;
    category: string; coverImage?: string; views: number; readTime: number;
  } | null;
}

export interface CategoryStat {
  category:       string;
  articleCount:   number;
  totalViews:     number;
  publishedCount: number;
}

export interface TopArticle {
  _id:         string;
  title:       string;
  slug:        string;
  category:    string;
  coverImage?: string;
  views:       number;
  readTime:    number;
  publishedAt?: string;
}

export async function getAnalyticsOverview(token: string): Promise<AnalyticsOverview> {
  return fetchAPI<AnalyticsOverview>(API_ENDPOINTS.ANALYTICS_OVERVIEW, token);
}

export async function getAnalyticsByCategory(token: string): Promise<{ categories: CategoryStat[] }> {
  return fetchAPI<{ categories: CategoryStat[] }>(API_ENDPOINTS.ANALYTICS_BY_CATEGORY, token);
}

export async function getTopArticles(
  token: string,
  params?: { limit?: number; from?: string; to?: string }
): Promise<{ articles: TopArticle[] }> {
  const q = new URLSearchParams();
  if (params?.limit) q.append('limit', String(params.limit));
  if (params?.from)  q.append('from',  params.from);
  if (params?.to)    q.append('to',    params.to);
  const qs = q.toString();
  return fetchAPI<{ articles: TopArticle[] }>(
    `${API_ENDPOINTS.ANALYTICS_TOP_ARTICLES}${qs ? `?${qs}` : ''}`,
    token
  );
}
