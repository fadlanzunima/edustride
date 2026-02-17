import type { Level } from "@/types";

export interface UserProfile {
  name: string;
  level: Level;
  institution: string;
}

export interface WidgetContent {
  roadmap: Record<Level, string>;
  trending_skills: Record<Level, string[]>;
}

export interface AppData {
  user_profile: UserProfile;
  widgets: WidgetContent;
}

export const levelThemes: Record<Level, { primary: string; secondary: string; accent: string }> = {
  SMA: {
    primary: "cyan",
    secondary: "lime",
    accent: "emerald"
  },
  S1: {
    primary: "blue",
    secondary: "indigo",
    accent: "violet"
  },
  "S2/S3": {
    primary: "slate",
    secondary: "zinc",
    accent: "amber"
  }
};

export const defaultAppData: AppData = {
  user_profile: {
    name: "Budi Santoso",
    level: "S1",
    institution: "Universitas Indonesia"
  },
  widgets: {
    roadmap: {
      SMA: "3 Langkah Menuju SNBT 2026",
      S1: "Persiapan Magang MBKM Semester 5",
      "S2/S3": "Deadline Publikasi Jurnal Scopus Q1"
    },
    trending_skills: {
      SMA: ["Basic Design", "Public Speaking", "Office Suite"],
      S1: ["Data Analytics", "Project Management", "Digital Marketing"],
      "S2/S3": ["Scientific Writing", "Advanced Statistics", "Grant Writing"]
    }
  }
};
