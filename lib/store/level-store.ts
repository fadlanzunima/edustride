import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Level, User } from "@/types";

// Feature flag: Set to true to enable SMA-only mode
// Can be controlled via environment variable
const SMA_ONLY_MODE = process.env.NEXT_PUBLIC_SMA_ONLY_MODE === "true";

// Available levels based on feature flag
const AVAILABLE_LEVELS: Level[] = SMA_ONLY_MODE
  ? ["SMA"]
  : ["SMA", "S1", "S2/S3"];

interface LevelState {
  currentLevel: Level | null;
  setLevel: (level: Level) => void;
  initializeFromSession: (sessionLevel: string | undefined) => void;
  availableLevels: Level[];
  isSMAOnlyMode: boolean;
}

export const useLevelStore = create<LevelState>()(
  persist(
    (set, get) => ({
      currentLevel: null,
      availableLevels: AVAILABLE_LEVELS,
      isSMAOnlyMode: SMA_ONLY_MODE,
      setLevel: (level) => {
        // In SMA-only mode, only allow SMA level
        if (SMA_ONLY_MODE && level !== "SMA") {
          console.warn("SMA-only mode: Cannot set level to", level);
          return;
        }
        set({ currentLevel: level });
      },
      initializeFromSession: (sessionLevel) => {
        console.log("Initializing from session:", sessionLevel);

        // In SMA-only mode, always default to SMA
        if (SMA_ONLY_MODE) {
          set({ currentLevel: "SMA" });
          return;
        }

        // Normal mode: Use session level
        const current = get().currentLevel;
        if (!current && sessionLevel) {
          const validLevel = AVAILABLE_LEVELS.includes(sessionLevel as Level)
            ? (sessionLevel as Level)
            : ("SMA" as Level);
          set({ currentLevel: validLevel });
        } else if (!current && !sessionLevel) {
          set({ currentLevel: "SMA" as Level });
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
