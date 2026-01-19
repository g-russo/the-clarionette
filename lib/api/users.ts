/**
 * API utility functions for user/auth operations
 */

import { API_CONFIG, API_ENDPOINTS } from './config';
import type { User, AuthUser, LoginCredentials, RegisterUserInput } from '@/types';

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

/**
 * Get all authors/editorial board members
 */
export async function getAuthors(): Promise<User[]> {
  return fetchAPI<User[]>(API_ENDPOINTS.AUTHORS);
}

/**
 * Get author by ID
 */
export async function getAuthorById(id: string): Promise<User> {
  return fetchAPI<User>(API_ENDPOINTS.AUTHOR_BY_ID(id));
}
