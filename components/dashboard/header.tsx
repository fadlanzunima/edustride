"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Bell, Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenu } from "@/components/auth/user-menu";
import { LanguageSwitcher } from "@/components/language-switcher/language-switcher";
import { CommandMenu } from "./command-menu";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { setTheme } = useTheme();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-20 flex-col justify-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Main Header */}
      <div className="flex h-20 items-center justify-between px-6 lg:px-8">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Command Menu */}
          <div className="hidden md:block">
            <CommandMenu />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden sm:flex">
                <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="mr-2 h-4 w-4" />
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="mr-2 h-4 w-4" />
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Laptop className="mr-2 h-4 w-4" />
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge
                  variant="destructive"
                  className="absolute -right-1 -top-1 h-5 min-w-5 px-1 text-xs"
                >
                  3
                </Badge>
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-3 py-2">
                <span className="font-semibold">Notifications</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto px-2 py-1 text-xs"
                >
                  Mark all as read
                </Button>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-auto">
                <NotificationItem
                  title="New achievement unlocked!"
                  description="You've completed your first portfolio project."
                  time="2 hours ago"
                />
                <NotificationItem
                  title="Skill assessment available"
                  description="Take the JavaScript skill test to earn a badge."
                  time="5 hours ago"
                />
                <NotificationItem
                  title="Weekly progress report"
                  description="Your learning activity for this week is ready."
                  time="1 day ago"
                />
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

interface NotificationItemProps {
  title: string;
  description: string;
  time: string;
}

function NotificationItem({ title, description, time }: NotificationItemProps) {
  return (
    <div className="flex flex-col gap-1 px-3 py-2 hover:bg-muted cursor-pointer">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground line-clamp-2">
        {description}
      </p>
      <p className="text-xs text-muted-foreground">{time}</p>
    </div>
  );
}
