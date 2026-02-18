"use client";

import { User, Settings, LogOut, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function DemoUserMenu() {
  // Demo user data - bypass authentication
  const demoUser = {
    name: "Demo Student",
    email: "demo@edustride.id",
    image: null,
    level: "S1",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={demoUser.image || undefined}
              alt={demoUser.name}
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {demoUser.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <Badge
            variant="secondary"
            className="absolute -bottom-1 -right-1 h-4 px-1 text-[10px]"
          >
            {demoUser.level}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">
                {demoUser.name}
              </p>
              <Badge variant="outline" className="text-[10px] h-4">
                <Sparkles className="h-3 w-3 mr-1" />
                Demo
              </Badge>
            </div>
            <p className="text-xs leading-none text-muted-foreground">
              {demoUser.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/dashboard/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/login">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
