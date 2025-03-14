import { ActivityPlaceType } from "@/types/event";
import { create } from "zustand";

interface MapState {
  suggestedLocations: ActivityPlaceType[];
  setSuggestedLocations: (locations: ActivityPlaceType[]) => void;
}

export const useMapStore = create<MapState>((set) => ({
  suggestedLocations: [],
  setSuggestedLocations: (locations) => set({ suggestedLocations: locations }),
}));
