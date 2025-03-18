import { ActivityPlaceType } from "@/types/map";
import { create } from "zustand";

interface MapState {
  suggestedLocations: ActivityPlaceType[];
  setSuggestedLocations: (locations: ActivityPlaceType[]) => void;
  placeId: string;
  setPlaceId: (id: string) => void;
  place: string;
  setPlace: (place: string) => void;
}

export const useMapStore = create<MapState>((set) => ({
  suggestedLocations: [],
  setSuggestedLocations: (locations) =>
    set(() => ({ suggestedLocations: locations })),
  placeId: "",
  setPlaceId: (id) => set(() => ({ placeId: id })),
  place: "",
  setPlace: (place) => set(() => ({ place })),
}));
