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
