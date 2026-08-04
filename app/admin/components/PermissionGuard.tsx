"use client";

import { useAuth } from "./AuthContext";
import type { Permission } from "@/types/permissions.types";

interface PermissionGuardProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Renders children only when the current user has the required permission.
 * Renders fallback (default: null) otherwise.
 */
export function PermissionGuard({
  permission,
  fallback = null,
  children,
}: PermissionGuardProps) {
  const { hasPermission } = useAuth();

  if (!hasPermission(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
