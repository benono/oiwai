"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useMapStore } from "@/lib/store/use-map-store";
import { showErrorToast } from "@/lib/toast/toast-utils";
import { LocationType, PlaceInformationType } from "@/types/map";
import { Loader } from "@googlemaps/js-api-loader";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Activities from "./activities";

interface MapWithMarkersProps {
  apiKey: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  isSuggest?: boolean;
  onPlaceSelect: (place: LocationType) => void;
}

export default function MapWithMarkers({
  apiKey,
  center = { lat: 49.2827, lng: -123.1207 }, // Vancouver City Hall
  zoom = 14,
  onPlaceSelect,
  isSuggest,
}: MapWithMarkersProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<PlaceInformationType | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setPlaceId, place, setPlace } = useMapStore();

  const { toast } = useToast();
  // Initialize the map
  useEffect(() => {
    if (!mapRef.current) return;

    if (isSuggest) {
      setPlaceId("");
    }

    async function initMap() {
      try {
        if (!window.google) {
          const loader = new Loader({
            apiKey,
            version: "weekly",
          });

          await loader.importLibrary("maps");
        }

        await google.maps.importLibrary("places");

        const mapInstance = new google.maps.Map(mapRef.current!, {
          center,
          zoom,
          mapTypeControl: false,
        });

        setMap(mapInstance);
      } catch (error) {
        showErrorToast(toast, error, "Failed to load the map.");
      }
    }

    initMap();
  }, [apiKey, center, zoom, toast, isSuggest, setPlaceId]);

  const clearMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  // Add pin on the map
  const addMarkers = (newPlaces: PlaceInformationType[]) => {
    const newMarkers = newPlaces.map((place) => {
      const marker = new google.maps.Marker({
        position: place.location,
        map,
        title: place.name,
        animation: google.maps.Animation.DROP,
      });

      clearMarkers();
      setPlace("");

      if (isSuggest) {
        marker.addListener("click", () => {
          setPlaceId("");

          setTimeout(() => {
            setPlaceId(place.id);
            setSelectedPlace(null);
          }, 10);
        });
      } else {
        const infoWindow = new google.maps.InfoWindow({
          content: `
          <div>
            <h3 style="margin: 0; font-size: 16px;">${place.name}</h3>
            <p style="margin: 5px 0 0;">${place.address}</p>
            <p style="margin: 5px 0 0; color: #666;">${place.type}</p>
          </div>
        `,
        });

        marker.addListener("click", () => {
          infoWindow.open({ anchor: marker, map });
          onPlaceSelect?.({
            latitude: place.location.lat,
            longitude: place.location.lng,
            address: place.address,
          });
        });
      }

      return marker;
    });

    setMarkers(newMarkers);

    if (newMarkers.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      newPlaces.forEach((place) => bounds.extend(place.location));
      if (map) {
        map.fitBounds(bounds);
      }
    }
  };

  const getCurrentLocation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!map) return;

    clearMarkers();
    setIsSearching(true);
    setPlace("");
    setSelectedPlace(null);
    setIsLoading(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          addMarkers([
            {
              id: "current",
              name: "Current Location",
              location,
              address: "Current Location",
              type: "Current Location",
            },
          ]);

          map.setCenter(location);
          map.setZoom(15);

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results) {
              const result = results[0];
              const selectedPlace: PlaceInformationType = {
                id: "current-location",
                name: result?.formatted_address || "Unknown Location",
                location: { lat: location.lat, lng: location.lng },
                address: result?.formatted_address || "No Address Found",
                type: "Current Location",
              };

              setSelectedPlace(selectedPlace);
            } else {
              showErrorToast(
                toast,
                new Error("Map functionality error"),
                "Failed to get the current location.",
              );
            }
          });
          setIsLoading(false);
        },
        (error) => {
          showErrorToast(toast, error, "Failed to get the current location.");
          setIsLoading(false);
        },
      );
    } else {
      showErrorToast(
        toast,
        new Error("Map functionality error"),
        "The map feature is not supported by this browser.",
      );
      setIsLoading(false);
    }
  };

  const searchPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!map || !place) return;

    const service = new google.maps.places.PlacesService(map);
    service.textSearch({ query: place }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        clearMarkers();

        const searchResults: PlaceInformationType[] = results.map(
          (result, index) => ({
            id: `search-${index}`,
            name: result.name || "",
            location: {
              lat: result.geometry?.location?.lat() || 0,
              lng: result.geometry?.location?.lng() || 0,
            },
            address: result.formatted_address || "",
            type: result.types?.join(", ") || "",
          }),
        );

        if (searchResults.length > 0) {
          setSelectedPlace(searchResults[0]);
          map.setCenter(searchResults[0].location);
          map.setZoom(15);
          addMarkers(searchResults);
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <div className="relative flex items-center">
          <div className="absolute left-2 text-gray-400">
            <MapPin size={18} className="text-textSub" />
          </div>
          <input
            type="text"
            onChange={(e) => {
              const newPlace = e.target.value;
              clearMarkers();
              setPlace(newPlace);
            }}
            value={place}
            className="h-12 flex-1 rounded-md border p-2 pl-8 text-base shadow-sm placeholder:text-textSub"
            placeholder="Search address"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchPlace(e);
                setIsSearching(true);
              }
            }}
          />
        </div>
        {selectedPlace && (
          <div className="flex flex-col rounded-md border px-2 py-3">
            <div className="space-y-2">
              <p className="font-semibold">Address Search Results:</p>
              <p>{selectedPlace.address}</p>
            </div>
            <Button
              className="ml-auto mt-2 h-auto w-1/2 rounded-full bg-accentGreen p-2 font-bold shadow-none hover:bg-accentGreen/70"
              onClick={(e) => {
                e.preventDefault();
                if (onPlaceSelect) {
                  onPlaceSelect({
                    latitude: selectedPlace.location.lat,
                    longitude: selectedPlace.location.lng,
                    address: selectedPlace.address,
                  });
                }
                setPlace(selectedPlace.address);
                setSelectedPlace(null);
                setIsSearching(false);
              }}
            >
              Use This Location
            </Button>
          </div>
        )}
        {!isSearching && !isLoading && (
          <button
            className="self-end rounded-full border border-textSub px-4 py-1 text-sm font-bold text-textSub hover:bg-textSub/10"
            onClick={getCurrentLocation}
          >
            Use Current Location
          </button>
        )}
        {isLoading && (
          <div className="flex animate-pulse items-center justify-center gap-2 text-accentGreen">
            <div className="h-4 w-4 animate-spin rounded-full border-4 border-accentGreen border-t-transparent"></div>
            <span className="text-sm font-bold">Searching...</span>
          </div>
        )}
      </div>
      <div className="relative">
        <div ref={mapRef} className="h-[320px] w-full rounded border"></div>
        {isSuggest && (
          <Activities addMarkers={addMarkers} onPlaceSelect={onPlaceSelect} />
        )}
      </div>
    </div>
  );
}
