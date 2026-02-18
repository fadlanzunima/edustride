import "next-auth";
import { JWT } from "next-auth/jwt";

export type Level = "SMA" | "S1" | "S2/S3";

export interface User {
  id: string;
  name: string;
  email: string;
  level: Level;
  institution: string;
  avatar?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: "beginner" | "intermediate" | "advanced";
  progress: number;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  deadline?: Date;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  type: "project" | "certificate" | "experience";
  date: Date;
  link?: string;
}

// Extend NextAuth types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      level?: string | null;
      institution?: string | null;
    };
  }

  interface User {
    level?: string | null;
    institution?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    level?: string | null;
    institution?: string | null;
  }
}
