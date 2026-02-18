import {
  LayoutDashboard,
  BarChart3,
  Activity,
  Settings,
  User,
  FolderOpen,
  GraduationCap,
  Briefcase,
  FileText,
  Award,
  Brain,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  title: string;
  titleId: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  badgeId?: string;
}

export interface NavGroup {
  title: string;
  titleId: string;
  items: NavItem[];
}

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    titleId: "dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Analytics",
    titleId: "analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Activities",
    titleId: "activities",
    href: "/dashboard/activities",
    icon: Activity,
    badge: "3",
    badgeId: "newActivities",
  },
];

export const portfolioNavItems: NavItem[] = [
  {
    title: "Portfolio",
    titleId: "portfolio",
    href: "/dashboard/portfolio",
    icon: FolderOpen,
  },
  {
    title: "Skills",
    titleId: "skills",
    href: "/dashboard/skills",
    icon: GraduationCap,
  },
  {
    title: "Quiz",
    titleId: "quiz",
    href: "/dashboard/quiz",
    icon: Brain,
    badge: "New",
    badgeId: "newQuiz",
  },
  {
    title: "Achievements",
    titleId: "achievements",
    href: "/dashboard/achievements",
    icon: Award,
    badge: "2",
    badgeId: "newAchievements",
  },
  {
    title: "Experience",
    titleId: "experience",
    href: "/dashboard/experience",
    icon: Briefcase,
  },
  {
    title: "Documents",
    titleId: "documents",
    href: "/dashboard/documents",
    icon: FileText,
  },
];

export const settingsNavItems: NavItem[] = [
  {
    title: "Profile",
    titleId: "profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    titleId: "settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export const navGroups: NavGroup[] = [
  {
    title: "Main",
    titleId: "main",
    items: mainNavItems,
  },
  {
    title: "Portfolio",
    titleId: "portfolio",
    items: portfolioNavItems,
  },
  {
    title: "Account",
    titleId: "account",
    items: settingsNavItems,
  },
];

// Mobile bottom navigation items (simplified)
export const mobileNavItems: NavItem[] = [
  {
    title: "Home",
    titleId: "home",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Portfolio",
    titleId: "portfolio",
    href: "/dashboard/portfolio",
    icon: FolderOpen,
  },
  {
    title: "Skills",
    titleId: "skills",
    href: "/dashboard/skills",
    icon: GraduationCap,
  },
  {
    title: "Settings",
    titleId: "settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];
