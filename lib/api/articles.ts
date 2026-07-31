import { API_CONFIG, API_ENDPOINTS } from './config';
import type {
  Article,
  ArticleListItem,
  ArticlesResponse,
  ArticleCategory,
  ArticleLayoutVariant,
  CreateArticleInput,
  UpdateArticleInput,
} from '@/types';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as { message?: string }).message || `API Error: ${response.status}`);
  }
  return response.json();
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

// ─── PUBLIC ──────────────────────────────────────────────────────────────────

export async function getPublicArticles(params?: {
  page?: number; limit?: number; category?: ArticleCategory; featured?: boolean; search?: string; tag?: string; articleStyle?: string;
}): Promise<ArticlesResponse> {
  const q = new URLSearchParams();
  if (params?.page) q.append('page', String(params.page));
  if (params?.limit) q.append('limit', String(params.limit));
  if (params?.category) q.append('category', params.category);
  if (params?.featured !== undefined) q.append('featured', String(params.featured));
  if (params?.search) q.append('search', params.search);
  if (params?.tag) q.append('tag', params.tag);
  if (params?.articleStyle) q.append('articleStyle', params.articleStyle);
  const qs = q.toString();
  return fetchAPI<ArticlesResponse>(`${API_ENDPOINTS.ARTICLES}/public${qs ? `?${qs}` : ''}`);
}

export async function getArticlesByCategory(
  category: ArticleCategory,
  params?: { page?: number; limit?: number }
): Promise<ArticlesResponse> {
  return getPublicArticles({ category, ...params });
}

export async function getArticleBySlug(slug: string): Promise<Article> {
  const data = await fetchAPI<{ article: Article }>(`${API_ENDPOINTS.ARTICLES}/public/${slug}`);
  return data.article;
}

export async function getFeaturedArticles(limit = 4): Promise<ArticleListItem[]> {
  const res = await getPublicArticles({ featured: true, limit });
  return res.articles;
}

export async function searchArticles(query: string, params?: { page?: number; limit?: number }): Promise<ArticlesResponse> {
  return getPublicArticles({ search: query, ...params });
}

// ─── PUBLIC: COMMENTS ────────────────────────────────────────────────────────

export interface PublicComment {
  _id: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export async function getArticleComments(articleId: string): Promise<PublicComment[]> {
  const data = await fetchAPI<{ comments: PublicComment[] }>(
    `${API_ENDPOINTS.ARTICLES}/${articleId}/comments`
  );
  return data.comments;
}

export async function submitArticleComment(
  articleId: string,
  data: { authorName: string; authorEmail?: string; content: string }
): Promise<{ comment: PublicComment; autoApproved: boolean }> {
  return fetchAPI<{ comment: PublicComment; autoApproved: boolean }>(
    `${API_ENDPOINTS.ARTICLES}/${articleId}/comments`,
    {
      method: 'POST',
      body: JSON.stringify(data),
    }
  );
}

// ─── ADMIN: CRUD ─────────────────────────────────────────────────────────────

export async function listAdminArticles(
  token: string,
  params?: {
    page?: number; limit?: number; category?: string;
    workflowStatus?: string; search?: string; featured?: boolean; articleStyle?: string;
  }
): Promise<ArticlesResponse> {
  const q = new URLSearchParams();
  if (params?.page) q.append('page', String(params.page));
  if (params?.limit) q.append('limit', String(params.limit));
  if (params?.category) q.append('category', params.category);
  if (params?.workflowStatus) q.append('workflowStatus', params.workflowStatus);
  if (params?.search) q.append('search', params.search);
  if (params?.featured !== undefined) q.append('featured', String(params.featured));
  if (params?.articleStyle) q.append('articleStyle', params.articleStyle);
  const qs = q.toString();
  return fetchAPI<ArticlesResponse>(`${API_ENDPOINTS.ARTICLES}${qs ? `?${qs}` : ''}`, {
    headers: authHeader(token),
  });
}

export async function getAdminArticle(token: string, id: string): Promise<Article> {
  const data = await fetchAPI<{ article: Article }>(API_ENDPOINTS.ARTICLE_BY_ID(id), {
    headers: authHeader(token),
  });
  return data.article;
}

export async function createArticle(data: CreateArticleInput, token: string): Promise<Article> {
  const res = await fetchAPI<{ article: Article }>(API_ENDPOINTS.ARTICLES, {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
  return res.article;
}

export async function updateArticle(id: string, data: UpdateArticleInput, token: string): Promise<Article> {
  const res = await fetchAPI<{ article: Article }>(`${API_ENDPOINTS.ARTICLES}/${id}`, {
    method: 'PUT',
    headers: authHeader(token),
    body: JSON.stringify(data),
  });
  return res.article;
}

export async function deleteArticle(id: string, token: string): Promise<void> {
  await fetchAPI<void>(`${API_ENDPOINTS.ARTICLES}/${id}`, {
    method: 'DELETE',
    headers: authHeader(token),
  });
}

// ─── ADMIN: LAYOUT ───────────────────────────────────────────────────────────

export async function saveArticleLayout(
  token: string,
  id: string,
  layoutBlocks: unknown[],
  layoutVariant?: ArticleLayoutVariant
): Promise<Article> {
  const res = await fetchAPI<{ article: Article }>(API_ENDPOINTS.ARTICLE_SAVE_LAYOUT(id), {
    method: 'PUT',
    headers: authHeader(token),
    body: JSON.stringify({ layoutBlocks, ...(layoutVariant && { layoutVariant }) }),
  });
  return res.article;
}

// ─── ADMIN: WORKFLOW ACTIONS ─────────────────────────────────────────────────

async function workflowPatch(token: string, url: string, body?: object): Promise<{ workflowStatus: string }> {
  return fetchAPI<{ workflowStatus: string }>(url, {
    method: 'PATCH',
    headers: authHeader(token),
    body: body ? JSON.stringify(body) : undefined,
  });
}

export const submitArticle = (token: string, id: string) =>
  workflowPatch(token, API_ENDPOINTS.ARTICLE_SUBMIT(id));

export const acceptReview = (token: string, id: string) =>
  workflowPatch(token, API_ENDPOINTS.ARTICLE_ACCEPT_REVIEW(id));

export const approveArticle = (token: string, id: string, note?: string) =>
  workflowPatch(token, API_ENDPOINTS.ARTICLE_APPROVE(id), note ? { note } : undefined);

export const rejectArticle = (token: string, id: string, note: string) =>
  workflowPatch(token, API_ENDPOINTS.ARTICLE_REJECT(id), { note });

export const markNeedsMedia = (token: string, id: string) =>
  workflowPatch(token, API_ENDPOINTS.ARTICLE_MARK_NEEDS_MEDIA(id));

export const skipToLayout = (token: string, id: string) =>
  workflowPatch(token, API_ENDPOINTS.ARTICLE_SKIP_TO_LAYOUT(id));

export const claimLayout = (token: string, id: string) =>
  workflowPatch(token, API_ENDPOINTS.ARTICLE_CLAIM_LAYOUT(id));

export const submitFinal = (token: string, id: string, note?: string) =>
  workflowPatch(token, API_ENDPOINTS.ARTICLE_SUBMIT_FINAL(id), note ? { note } : undefined);

export const publishArticle = (token: string, id: string) =>
  workflowPatch(token, API_ENDPOINTS.ARTICLE_PUBLISH(id));

export const scheduleArticle = (token: string, id: string, scheduledPublishAt: string) =>
  workflowPatch(token, API_ENDPOINTS.ARTICLE_SCHEDULE(id), { scheduledPublishAt });

export const archiveArticle = (token: string, id: string) =>
  workflowPatch(token, API_ENDPOINTS.ARTICLE_ARCHIVE(id));

// ─── ADMIN: ANNOTATIONS ──────────────────────────────────────────────────────

export async function addAnnotation(
  token: string,
  articleId: string,
  content: string,
  targetText?: string
) {
  return fetchAPI<{ annotation: unknown }>(API_ENDPOINTS.ARTICLE_ANNOTATIONS(articleId), {
    method: 'POST',
    headers: authHeader(token),
    body: JSON.stringify({ content, targetText }),
  });
}

export async function resolveAnnotation(token: string, articleId: string, annotationId: string) {
  return fetchAPI<{ message: string }>(
    API_ENDPOINTS.ARTICLE_ANNOTATION_RESOLVE(articleId, annotationId),
    { method: 'PATCH', headers: authHeader(token) }
  );
}
