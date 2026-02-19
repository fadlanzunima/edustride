import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Level, User } from "@/types";

interface LevelState {
  currentLevel: Level | null;
  setLevel: (level: Level) => void;
  initializeFromSession: (sessionLevel: string | undefined) => void;
}

export const useLevelStore = create<LevelState>()(
  persist(
    (set, get) => ({
      currentLevel: null, // No default - will be set from session
      setLevel: (level) => set({ currentLevel: level }),
      initializeFromSession: (sessionLevel) => {
        console.log("Initializing from session:", sessionLevel);
        // Only initialize if not already set (from localStorage)
        const current = get().currentLevel;
        if (!current && sessionLevel) {
          const validLevel = ["SMA", "S1", "S2/S3"].includes(sessionLevel)
            ? (sessionLevel as Level)
            : ("S1" as Level);
          set({ currentLevel: validLevel });
        } else if (!current && !sessionLevel) {
          // Fallback to S1 only if no session and no stored value
          set({ currentLevel: "S1" as Level });
        } else {
          set({ currentLevel: sessionLevel as Level });
        }
      },
    }),
    {
      name: "edustride-level",
    }
  )
);

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "edustride-user",
    }
  )
);
