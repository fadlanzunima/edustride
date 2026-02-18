"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { DialogProps } from "@radix-ui/react-dialog";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Calculator,
  Calendar,
  CreditCard,
  Settings,
  Smile,
  User,
  Briefcase,
  GraduationCap,
  BookOpen,
  Trophy,
  FileText,
  Folder,
  Laptop,
  Moon,
  Sun,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { navGroups } from "@/lib/data/navigation";

export function CommandMenu({ ...props }: DialogProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const { setTheme } = useTheme();
  const t = useTranslations("navigation");

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  // Get locale from pathname or default to 'id'
  const locale = typeof window !== "undefined" 
    ? window.location.pathname.split("/")[1] || "id"
    : "id";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="relative flex w-full items-center justify-between rounded-lg border border-input bg-background px-4 py-3 text-base text-muted-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-80 lg:w-[400px]"
        aria-label="Search or type a command"
      >
        <span className="flex items-center gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="hidden lg:inline">Search or type a command...</span>
          <span className="lg:hidden">Search...</span>
        </span>
        <kbd className="pointer-events-none inline-flex h-7 select-none items-center gap-1.5 rounded border bg-muted px-2.5 font-mono text-[11px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen} {...props}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {/* Navigation Groups */}
          {navGroups.map((group) => (
            <CommandGroup key={group.titleId} heading={t(group.titleId)}>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <CommandItem
                    key={item.href}
                    value={item.href}
                    onSelect={() => {
                      runCommand(() => router.push(`/${locale}${item.href}`));
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span>{t(item.titleId)}</span>
                    {item.badge && (
                      <CommandShortcut>{item.badge}</CommandShortcut>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          ))}

          <CommandSeparator />

          {/* Theme Toggle */}
          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              Light
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              Dark
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop className="mr-2 h-4 w-4" />
              System
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
