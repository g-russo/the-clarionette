/**
 * API utility functions for user/auth operations
 */

import { API_CONFIG, API_ENDPOINTS } from './config';
import type { User, AuthUser, LoginCredentials, RegisterUserInput } from '@/types';
import type { Role, CreateRoleInput, UpdateRoleInput } from '@/types/permissions.types';

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
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
 * Login user
 */
export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  return fetchAPI<AuthUser>(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

/**
 * Register new user
 */
export async function register(data: RegisterUserInput): Promise<AuthUser> {
  return fetchAPI<AuthUser>(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get current user (requires authentication)
 */
export async function getCurrentUser(token: string): Promise<User> {
  return fetchAPI<User>(API_ENDPOINTS.ME, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export interface PublicStaffMember {
  _id: string;
  name: string;
  position?: string;
  bio?: string;
  avatar?: string;
  roleName: string;
  roleSlug?: string;
  roleSection: string;
}

export async function getPublicStaff(): Promise<PublicStaffMember[]> {
  const data = await fetchAPI<{ staff: PublicStaffMember[] }>(`${API_ENDPOINTS.USERS}/public`);
  return data.staff;
}

export interface PublicAuthorArticle {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage?: string;
  readTime: number;
  views: number;
  publishedAt?: string;
  createdAt: string;
  featured: boolean;
}

export interface PublicMediaContribution {
  _id: string;
  url: string;
  type: 'photo' | 'cartoon' | 'video';
  caption?: string;
  createdAt: string;
  article: {
    _id: string;
    title: string;
    slug: string;
    category: string;
    publishedAt?: string;
    coverImage?: string;
  };
}

export interface PublicAuthorProfile extends PublicStaffMember {
  articles: PublicAuthorArticle[];
  mediaContributions: PublicMediaContribution[];
}

export async function getPublicAuthorProfile(id: string): Promise<PublicAuthorProfile> {
  const data = await fetchAPI<{ author: PublicStaffMember; articles: PublicAuthorArticle[]; mediaContributions: PublicMediaContribution[] }>(
    API_ENDPOINTS.USER_PUBLIC_PROFILE(id)
  );
  return { ...data.author, articles: data.articles, mediaContributions: data.mediaContributions ?? [] };
}

export async function getAuthors(): Promise<User[]> {
  return fetchAPI<User[]>(API_ENDPOINTS.AUTHORS);
}

/**
 * Get author by ID
 */
export async function getAuthorById(id: string): Promise<User> {
  return fetchAPI<User>(API_ENDPOINTS.AUTHOR_BY_ID(id));
}

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export async function listAdminUsers(
  token: string,
  filters?: { section?: string; isActive?: boolean; search?: string }
): Promise<User[]> {
  const params = new URLSearchParams();
  if (filters?.section) params.set('section', filters.section);
  if (filters?.isActive !== undefined) params.set('isActive', String(filters.isActive));
  if (filters?.search) params.set('search', filters.search);
  const qs = params.toString();
  const data = await fetchAPI<{ users: User[] }>(`${API_ENDPOINTS.USERS}${qs ? `?${qs}` : ''}`, {
    headers: authHeader(token),
  });
  return data.users;
}

export async function createAdminUser(
  token: string,
  data: { name: string; email: string; password: string; roleId: string }
): Promise<User> {
  const res = await fetchAPI<{ user: User }>(API_ENDPOINTS.USERS, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: authHeader(token),
  });
  return res.user;
}

export async function updateAdminUser(
  token: string,
  id: string,
  data: { name?: string; roleId?: string; position?: string; bio?: string; avatar?: string }
): Promise<User> {
  const res = await fetchAPI<{ user: User }>(API_ENDPOINTS.USER_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: authHeader(token),
  });
  return res.user;
}

export async function listAdminRoles(token: string): Promise<Role[]> {
  const data = await fetchAPI<{ roles: Role[] }>(API_ENDPOINTS.ROLES, {
    headers: authHeader(token),
  });
  return data.roles;
}

export async function createAdminRole(token: string, data: CreateRoleInput): Promise<Role> {
  return fetchAPI<Role>(API_ENDPOINTS.ROLES, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: authHeader(token),
  });
}

export async function updateAdminRole(token: string, id: string, data: UpdateRoleInput): Promise<Role> {
  return fetchAPI<Role>(API_ENDPOINTS.ROLE_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: authHeader(token),
  });
}

export async function deactivateAdminRole(token: string, id: string): Promise<void> {
  await fetchAPI<{ message: string }>(API_ENDPOINTS.ROLE_DEACTIVATE(id), {
    method: 'PATCH',
    headers: authHeader(token),
  });
}

export async function activateAdminRole(token: string, id: string): Promise<void> {
  await fetchAPI<{ message: string }>(API_ENDPOINTS.ROLE_ACTIVATE(id), {
    method: 'PATCH',
    headers: authHeader(token),
  });
}

export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  await fetchAPI<{ message: string }>(API_ENDPOINTS.CHANGE_PASSWORD, {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
    headers: authHeader(token),
  });
}

export async function uploadAvatar(token: string, file: File): Promise<string> {
  const formData = new FormData();
  formData.append('avatar', file);
  const res = await fetch(`${API_CONFIG.BASE_URL}/users/me/avatar`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message ?? 'Avatar upload failed');
  }
  const data = await res.json();
  return data.avatar as string;
}

export async function deactivateAdminUser(token: string, id: string): Promise<User> {
  return fetchAPI<User>(API_ENDPOINTS.USER_DEACTIVATE(id), {
    method: 'PATCH',
    headers: authHeader(token),
  });
}

export async function reactivateAdminUser(token: string, id: string): Promise<User> {
  return fetchAPI<User>(API_ENDPOINTS.USER_REACTIVATE(id), {
    method: 'PATCH',
    headers: authHeader(token),
  });
}
