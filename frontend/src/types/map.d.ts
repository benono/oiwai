export type ActivityPlaceType = {
  name: string;
  place_id: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  rating?: number;
  userRatingsTotal?: number;
  photos: string[];
  activityType: string;
  website?: string;
  phone?: string;
  openingHours?: string[];
  priceLevel: string;
};

export type ActivityLocationRequestType = {
  activity_type: string;
  latitude: number;
  longitude: number;
  radius: number;
};

export type PlaceType = {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  address: string;
  type: string;
};

export type LocationType = {
  latitude: number;
  longitude: number;
  address: string;
};
