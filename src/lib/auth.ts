import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import type { Session } from "next-auth";

/**
 * Get the current session on the server side
 * Use this in Server Components, API routes, and server actions
 */
export async function getSession(): Promise<Session | null> {
  return await getServerSession(authOptions);
}

/**
 * Get the current user from the session
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Check if the current user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session?.user;
}

/**
 * Check if the current user has admin role
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  return session?.user?.role === "admin";
}

/**
 * Check if the current user has employee role
 */
export async function isEmployee(): Promise<boolean> {
  const session = await getSession();
  return session?.user?.role === "employee";
}

/**
 * Require authentication - throw error if not authenticated
 * Use this in API routes and server actions
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session?.user) {
    throw new Error("Authentication required");
  }
  return session.user;
}

/**
 * Require admin role - throw error if not admin
 */
export async function requireAdmin() {
  const user = await requireAuth();
  if (user.role !== "admin") {
    throw new Error("Admin access required");
  }
  return user;
}

/**
 * Require specific role - throw error if role doesn't match
 */
export async function requireRole(role: "admin" | "employee") {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error(`${role} access required`);
  }
  return user;
}

// Type definitions for better TypeScript support
export type AuthUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  role: "admin" | "employee";
};

export type AuthSession = Session & {
  user: AuthUser;
};