import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Require admin access - redirects non-admin users
 * Use this in server components and API routes
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return session;
}

/**
 * Check if current user is admin (returns boolean)
 * Use this for conditional rendering in server components
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();
  return session?.user?.role === "ADMIN";
}

/**
 * Get current user role
 * Returns the role or null if not authenticated
 */
export async function getUserRole(): Promise<"USER" | "ADMIN" | null> {
  const session = await auth();
  return session?.user?.role ?? null;
}
