"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { navGroups, type NavItem } from "@/lib/data/navigation";
import { useTranslations } from "next-intl";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  const t = useTranslations("navigation");
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-80 p-0"
        aria-describedby="sidebar-description"
      >
        <div id="sidebar-description" className="sr-only">
          Navigation sidebar with main menu items
        </div>
        {/* Header */}
        <SheetHeader className="border-b p-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">
                  E
                </span>
              </div>
              <span className="text-lg font-semibold">EduStride</span>
            </SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        {/* Navigation */}
        <ScrollArea className="h-[calc(100vh-5rem)]">
          <nav className="space-y-6 p-4">
            {navGroups.map((group, groupIndex) => (
              <div key={group.titleId} className="space-y-2">
                <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t(group.titleId)}
                </h4>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <MobileNavLink
                      key={item.href}
                      item={item}
                      isActive={pathname === item.href}
                      onClick={() => onOpenChange(false)}
                    />
                  ))}
                </div>
                {groupIndex < navGroups.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

interface MobileNavLinkProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

function MobileNavLink({ item, isActive, onClick }: MobileNavLinkProps) {
  const t = useTranslations("navigation");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "min-h-[44px]", // Touch target optimization
        isActive && "bg-accent text-accent-foreground"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
      <span className="flex-1">{t(item.titleId)}</span>
      {item.badge && (
        <Badge variant="secondary" className="h-5 min-w-5 px-1 text-xs">
          {item.badge}
        </Badge>
      )}
    </Link>
  );
}
