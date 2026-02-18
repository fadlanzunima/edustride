"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

export function Breadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = React.useMemo(() => {
    const parts = pathname.split("/").filter(Boolean);
    // Skip the first part if it's a locale (en/id)
    const startIndex = parts[0] === "en" || parts[0] === "id" ? 1 : 0;
    
    const items = parts.slice(startIndex).map((part, index) => {
      const actualIndex = index + startIndex;
      const href = "/" + parts.slice(0, actualIndex + 1).join("/");
      const label = part
        .replace(/-/g, " ")
        .replace(/^\w/, (c) => c.toUpperCase());
      return { label, href };
    });

    return items;
  }, [pathname]);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav
      className="flex items-center gap-1 text-sm text-muted-foreground"
      aria-label="Breadcrumb"
    >
      <Link
        href="/dashboard"
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.slice(1).map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 2;
        return (
          <React.Fragment key={crumb.href}>
            <ChevronRight className="h-4 w-4 mx-1" />
            {isLast ? (
              <span
                className="font-medium text-foreground"
                aria-current="page"
              >
                {crumb.label}
              </span>
            ) : (
              <Link
                href={crumb.href}
                className="hover:text-foreground transition-colors"
              >
                {crumb.label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
