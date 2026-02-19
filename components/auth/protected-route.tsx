"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  allowDemo?: boolean;
}

export function ProtectedRoute({
  children,
  fallback,
  allowDemo = true,
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const { isDemoMode, enableDemoMode, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "id";

  useEffect(() => {
    // Only redirect if not loading, not authenticated, and not in demo mode
    if (status === "unauthenticated" && !isDemoMode && !allowDemo) {
      router.push(`/${locale}/login`);
    }
  }, [status, isDemoMode, router, locale, allowDemo]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If authenticated (real session or demo mode), render children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If unauthenticated but demo mode is allowed, show demo mode option
  if (status === "unauthenticated" && allowDemo) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Authentication Required</CardTitle>
            <CardDescription>
              Please sign in to access this page, or continue in demo mode to
              explore the features.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="default"
              className="w-full"
              onClick={() => router.push(`/${locale}/login`)}
            >
              Sign In
            </Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                console.log(
                  "ProtectedRoute: Enabling demo mode from button click"
                );
                enableDemoMode();
              }}
            >
              Continue in Demo Mode
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If unauthenticated and demo mode not allowed, return null (redirect will happen)
  return null;
}

// Simple wrapper that just protects the route without showing demo option
export function SimpleProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const locale = (params.locale as string) || "id";

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/${locale}/login`);
    }
  }, [status, router, locale]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  return <>{children}</>;
}
