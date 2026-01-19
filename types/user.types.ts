/**
 * User types for MongoDB + Express backend
 */

export type UserRole = 'admin' | 'editor' | 'writer' | 'reader';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  position?: string; // e.g., "Editor-in-Chief", "Sports Editor"
  social?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  position?: string;
}
