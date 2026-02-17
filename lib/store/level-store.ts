import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Level, User } from "@/types";

interface LevelState {
  currentLevel: Level;
  setLevel: (level: Level) => void;
}

export const useLevelStore = create<LevelState>()(
  persist(
    (set) => ({
      currentLevel: "S1",
      setLevel: (level) => set({ currentLevel: level }),
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
