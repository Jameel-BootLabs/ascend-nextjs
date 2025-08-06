'use client';

import { useSession } from "next-auth/react";
import type { Session } from "next-auth";

/**
 * Client-side authentication hook
 * Use this in Client Components
 */
export function useAuth() {
  const { data: session, status } = useSession();
  
  return {
    user: session?.user ?? null,
    session: session,
    isLoading: status === "loading",
    isAuthenticated: !!session?.user,
    isAdmin: session?.user?.role === "admin",
    isEmployee: session?.user?.role === "employee",
    status,
  };
}

/**
 * Hook to check if user has specific role
 */
export function useRole(role: "admin" | "employee") {
  const { user } = useAuth();
  return user?.role === role;
}

/**
 * Hook to require authentication (redirects if not authenticated)
 */
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (!isLoading && !isAuthenticated) {
    // In a real app, you might want to redirect to sign-in page
    // For now, we'll just return the auth state
    return { isAuthenticated: false, isLoading: false };
  }
  
  return { isAuthenticated, isLoading };
}

/**
 * Hook to require admin role
 */
export function useRequireAdmin() {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  
  return {
    hasAccess: isAuthenticated && isAdmin,
    isLoading,
    isAuthenticated,
    isAdmin,
  };
}

export type AuthHookReturn = ReturnType<typeof useAuth>;