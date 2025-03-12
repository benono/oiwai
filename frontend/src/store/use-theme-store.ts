import { create } from "zustand";

interface ThemeState {
  themeColor: string;
  setThemeColor: (theme: string) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  themeColor: "",
  setThemeColor: (themeColor) => set({ themeColor }),
}));
