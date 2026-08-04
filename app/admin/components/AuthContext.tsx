"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Permission, RoleSection } from "@/types/permissions.types";
import { getCurrentUser } from "@/lib/api/users";

export interface AuthUser {
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
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  permissions: Permission[];
  hasPermission: (permission: Permission) => boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const savedUser = localStorage.getItem("adminUser");

    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser) as AuthUser;
        setUser(userData);
        setIsLoading(false);

        // Background revalidation: confirm token is still valid and refresh permissions
        getCurrentUser(token)
          .then((fresh) => {
            const refreshed: AuthUser = {
              _id: fresh._id,
              name: fresh.name,
              email: fresh.email,
              roleId: fresh.roleId,
              roleName: fresh.roleName,
              roleSlug: fresh.roleSlug,
              roleSection: fresh.roleSection,
              permissions: fresh.permissions,
              isActive: fresh.isActive,
              avatar: fresh.avatar,
            };
            setUser(refreshed);
            localStorage.setItem("adminUser", JSON.stringify(refreshed));
          })
          .catch(() => {
            setUser(null);
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
          });
      } catch {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      const isAdminRoute = pathname?.startsWith("/admin");
      const isLoginPage = pathname === "/admin/login" || pathname === "/admin";

      if (isAdminRoute && !isLoginPage && !user) {
        router.push("/admin/login");
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (userData: AuthUser, token: string) => {
    setUser(userData);
    localStorage.setItem("adminToken", token);
    localStorage.setItem("adminUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    document.cookie = "admin_auth=; path=/; max-age=0; SameSite=Strict";
    router.push("/admin/login");
  };

  const permissions: Permission[] = user?.permissions ?? [];

  const hasPermission = (permission: Permission): boolean =>
    permissions.includes(permission);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        permissions,
        hasPermission,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
