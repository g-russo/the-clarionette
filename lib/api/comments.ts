import { API_CONFIG, API_ENDPOINTS } from './config';
import type { Comment, CommentsResponse } from '@/types';

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options?.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data as { message?: string }).message || `API Error: ${res.status}`);
  return data as T;
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function listAdminComments(
  token: string,
  filters?: {
    status?: string; articleId?: string; search?: string; page?: number; limit?: number;
  }
): Promise<CommentsResponse> {
  const q = new URLSearchParams();
  if (filters?.status && filters.status !== 'all') q.append('status', filters.status);
  if (filters?.articleId) q.append('articleId', filters.articleId);
  if (filters?.search) q.append('search', filters.search);
  if (filters?.page) q.append('page', String(filters.page));
  if (filters?.limit) q.append('limit', String(filters.limit));
  const qs = q.toString();
  return fetchJSON<CommentsResponse>(`${API_ENDPOINTS.COMMENTS}${qs ? `?${qs}` : ''}`, {
    headers: authHeader(token),
  });
}

export async function approveComment(token: string, id: string): Promise<Comment> {
  const data = await fetchJSON<{ comment: Comment }>(API_ENDPOINTS.COMMENT_APPROVE(id), {
    method: 'PATCH',
    headers: authHeader(token),
  });
  return data.comment;
}

export async function rejectComment(token: string, id: string): Promise<Comment> {
  const data = await fetchJSON<{ comment: Comment }>(API_ENDPOINTS.COMMENT_REJECT(id), {
    method: 'PATCH',
    headers: authHeader(token),
  });
  return data.comment;
}

export async function deleteComment(token: string, id: string): Promise<void> {
  await fetchJSON<{ message: string }>(API_ENDPOINTS.COMMENT_DELETE(id), {
    method: 'DELETE',
    headers: authHeader(token),
  });
}
