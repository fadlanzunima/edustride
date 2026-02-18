"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mobileNavItems } from "@/lib/data/navigation";
import { useTranslations } from "next-intl";

export function MobileNav() {
  const t = useTranslations("navigation");
  const pathname = usePathname();

  // Get locale from pathname
  const locale = pathname.split("/")[1] || "id";

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 lg:hidden",
        "border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      )}
      aria-label="Mobile navigation"
    >
      <div className="flex h-16 items-center justify-around px-2 safe-area-pb">
        {mobileNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.endsWith(item.href);
          const href = `/${locale}${item.href}`;

          return (
            <Link
              key={item.href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5",
                "min-w-[64px] min-h-[44px] rounded-lg",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                className={cn(
                  "h-5 w-5",
                  isActive && "text-primary"
                )}
              />
              <span className="text-xs font-medium">{t(item.titleId)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
