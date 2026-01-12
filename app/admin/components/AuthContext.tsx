"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  username: string;
  role: string;
  loginTime: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = localStorage.getItem("adminToken");
    const savedUser = localStorage.getItem("adminUser");
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
      }
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Redirect logic based on authentication status
    if (!isLoading) {
      const isAdminRoute = pathname?.startsWith("/admin");
      const isLoginPage = pathname === "/admin";
      
      if (isAdminRoute && !isLoginPage && !user) {
        // User is trying to access admin routes but not authenticated
        router.push("/admin");
      }
    }
  }, [user, isLoading, pathname, router]);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem("adminToken", "authenticated");
    localStorage.setItem("adminUser", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    router.push("/admin");
  };

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
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
