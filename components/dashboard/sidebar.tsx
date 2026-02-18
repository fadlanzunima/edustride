"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { navGroups, type NavItem } from "@/lib/data/navigation";
import { useTranslations } from "next-intl";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const t = useTranslations("navigation");
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r bg-sidebar",
          "hidden lg:flex"
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <span className="text-sm font-bold text-primary-foreground">
                    E
                  </span>
                </div>
                <span className="text-lg font-semibold">EduStride</span>
              </motion.div>
            )}
          </AnimatePresence>
          {isCollapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">
                E
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              "h-8 w-8",
              isCollapsed &&
                "absolute -right-4 top-6 rounded-full border bg-background shadow-sm"
            )}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </Button>
        </div>

        <Separator />

        {/* Navigation */}
        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-6 px-2">
            {navGroups.map((group, groupIndex) => (
              <div key={group.titleId} className="space-y-2">
                {!isCollapsed && (
                  <h4 className="px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {t(group.titleId)}
                  </h4>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.href}
                      item={item}
                      isActive={pathname === item.href}
                      isCollapsed={isCollapsed}
                    />
                  ))}
                </div>
                {groupIndex < navGroups.length - 1 && !isCollapsed && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4">
          <div
            className={cn(
              "flex items-center gap-3",
              isCollapsed && "justify-center"
            )}
          >
            <div className="h-2 w-2 rounded-full bg-green-500" />
            {!isCollapsed && (
              <span className="text-xs text-muted-foreground">Online</span>
            )}
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
  isCollapsed: boolean;
}

function NavLink({ item, isActive, isCollapsed }: NavLinkProps) {
  const t = useTranslations("navigation");
  const Icon = item.icon;

  const content = (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
        isCollapsed && "justify-center px-2"
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
      {!isCollapsed && (
        <>
          <span className="flex-1">{t(item.titleId)}</span>
          {item.badge && (
            <Badge variant="secondary" className="h-5 min-w-5 px-1 text-xs">
              {item.badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          {t(item.titleId)}
          {item.badge && (
            <Badge variant="secondary" className="h-5 min-w-5 px-1 text-xs">
              {item.badge}
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
