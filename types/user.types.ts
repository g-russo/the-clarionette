import type { Permission, RoleSection } from './permissions.types';

export interface User {
  _id: string;
  name: string;
  email: string;
  roleId: string;
  roleName: string;
  roleSlug: string;
  roleSection: RoleSection;
  permissions: Permission[];
  isActive: boolean;
  avatar?: string;
  bio?: string;
  position?: string;
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
  roleId: string;
  position?: string;
}
