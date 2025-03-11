import { create } from "zustand";

interface ThemeState {
  themeColor: string | null;
  setThemeColor: (theme: string | null) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeColor: null,
  setThemeColor: (themeColor) => set({ themeColor }),
}));
