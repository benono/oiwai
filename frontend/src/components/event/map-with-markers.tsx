"use client";

import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";

interface Place {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  address: string;
  type: string; // 例: "park", "restaurant" など
}

interface MapWithMarkersProps {
  apiKey: string;
  center?: { lat: number; lng: number };
  zoom?: number;
  places?: Place[];
  onPlaceSelect?: (place: Place) => void;
}

export default function MapWithMarkers({
  apiKey,
  center = { lat: 35.6812, lng: 139.7671 }, // デフォルトは東京
  zoom = 14,
  places = [],
  onPlaceSelect,
}: MapWithMarkersProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [place, setPlace] = useState<string>("");
  // const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  // マップの初期化
  useEffect(() => {
    if (!mapRef.current) return;

    const loader = new Loader({
      apiKey,
      version: "weekly",
      libraries: ["places"],
    });

    loader.load().then(() => {
      const mapInstance = new google.maps.Map(mapRef.current!, {
        center,
        zoom,
        mapTypeControl: false,
      });
      setMap(mapInstance);
    });
  }, [apiKey, center, zoom]);

  // 現在地を取得
  const getCurrentLocation = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!map) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const location = { lat, lng };

          const geocoder = new google.maps.Geocoder();
          geocoder.geocode({ location }, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK && results) {
              const result = results[0];
              const selectedPlace: Place = {
                id: "current-location",
                name: result?.formatted_address || "Unknown Location",
                location: {
                  lat,
                  lng,
                },
                address: result?.formatted_address || "No Address Found",
                type: "Current Location",
              };

              onPlaceSelect?.(selectedPlace);
              map.setCenter(location);
              map.setZoom(15);
            } else {
              console.error(
                "Geocode was not successful for the following reason: " +
                  status,
              );
            }
          });
        },
        (error) => {
          console.error("Error getting current location:", error);
        },
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // Tim Hortons店舗を検索する関数
  const searchTimHortons = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!map) return;

    const service = new google.maps.places.PlacesService(map);
    service.textSearch(
      {
        query: "Tim Hortons downtown",
        // ダウンタウンエリアに限定するため、位置と半径を指定することもできます
        // location: new google.maps.LatLng(center.lat, center.lng),
        // radius: 5000, // 5km
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // 既存のマーカーをクリア
          markers.forEach((marker) => marker.setMap(null));

          // 最大3件の結果を取得
          const limitedResults = results.slice(0, 3);

          // 検索結果から場所データを作成
          const searchResults: Place[] = limitedResults.map(
            (result, index) => ({
              id: `timhortons-${index}`,
              name: result.name || "",
              location: {
                lat: result.geometry?.location?.lat() || 0,
                lng: result.geometry?.location?.lng() || 0,
              },
              address: result.formatted_address || "",
              type: "Coffee Shop",
            }),
          );

          // 地図の表示範囲を調整
          if (searchResults.length > 0) {
            const bounds = new google.maps.LatLngBounds();
            searchResults.forEach((place) => {
              bounds.extend(place.location);
            });
            map.fitBounds(bounds);

            // 新しいマーカーを作成
            const newMarkers = searchResults.map((place) => {
              const marker = new google.maps.Marker({
                position: place.location,
                map,
                title: place.name,
                animation: google.maps.Animation.DROP,
              });

              // 情報ウィンドウを作成
              const infoWindow = new google.maps.InfoWindow({
                content: `
                  <div>
                    <h3 style="margin: 0; font-size: 16px;">${place.name}</h3>
                    <p style="margin: 5px 0 0;">${place.address}</p>
                    <p style="margin: 5px 0 0; color: #666;">Coffee Shop</p>
                  </div>
                `,
              });

              // マーカークリックイベント
              marker.addListener("click", () => {
                infoWindow.open({
                  anchor: marker,
                  map,
                });

                // setSelectedPlace(place);
                onPlaceSelect?.(place);
              });

              return marker;
            });

            setMarkers(newMarkers);
          }
        }
      },
    );
  };

  // 場所を検索する関数
  const searchPlace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!map || !place) return;

    const service = new google.maps.places.PlacesService(map);
    service.textSearch(
      {
        query: place,
      },
      (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          // 既存のマーカーをクリア
          markers.forEach((marker) => marker.setMap(null));

          // 検索結果から場所データを作成
          const searchResults: Place[] = results.map((result, index) => ({
            id: `search-${index}`,
            name: result.name || "",
            location: {
              lat: result.geometry?.location?.lat() || 0,
              lng: result.geometry?.location?.lng() || 0,
            },
            address: result.formatted_address || "",
            type: result.types?.join(", ") || "",
          }));

          // 最初の結果を選択
          if (searchResults.length > 0) {
            onPlaceSelect?.(searchResults[0]);

            // 地図の中心を移動
            map.setCenter(searchResults[0].location);
            map.setZoom(15);

            // 新しいマーカーを作成
            const newMarkers = searchResults.map((place) => {
              const marker = new google.maps.Marker({
                position: place.location,
                map,
                title: place.name,
                animation: google.maps.Animation.DROP,
              });

              // 情報ウィンドウを作成
              const infoWindow = new google.maps.InfoWindow({
                content: `
                  <div>
                    <h3 style="margin: 0; font-size: 16px;">${place.name}</h3>
                    <p style="margin: 5px 0 0;">${place.address}</p>
                    <p style="margin: 5px 0 0; color: #666;">${place.type}</p>
                  </div>
                `,
              });

              // マーカークリックイベント
              marker.addListener("click", () => {
                infoWindow.open({
                  anchor: marker,
                  map,
                });

                // setSelectedPlace(place);
                onPlaceSelect?.(place);
              });

              return marker;
            });

            setMarkers(newMarkers);
          }
        }
      },
    );
  };

  // マーカーの設定
  useEffect(() => {
    if (!map || !places.length) return;

    // 既存のマーカーをクリア
    markers.forEach((marker) => marker.setMap(null));

    // 新しいマーカーを作成
    const newMarkers = places.map((place) => {
      const marker = new google.maps.Marker({
        position: place.location,
        map,
        title: place.name,
        animation: google.maps.Animation.DROP,
      });

      // 情報ウィンドウを作成
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div>
            <h3 style="margin: 0; font-size: 16px;">${place.name}</h3>
            <p style="margin: 5px 0 0;">${place.address}</p>
            <p style="margin: 5px 0 0; color: #666;">${place.type}</p>
          </div>
        `,
      });

      // マーカークリックイベント
      marker.addListener("click", () => {
        // 他の情報ウィンドウを閉じる
        markers.forEach((m) => {
          if (m.getTitle() !== marker.getTitle()) {
            google.maps.event.trigger(m, "closeclick");
          }
        });

        infoWindow.open({
          anchor: marker,
          map,
        });

        // 選択された場所を設定
        const selectedPlace = places.find((p) => p.name === marker.getTitle());
        if (selectedPlace) {
          // setSelectedPlace(selectedPlace);
          onPlaceSelect?.(selectedPlace);
        }
      });

      return marker;
    });

    setMarkers(newMarkers);

    // マップの表示範囲を調整
    if (newMarkers.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        bounds.extend(place.location);
      });
      map.fitBounds(bounds);
    }

    return () => {
      newMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [map, places, onPlaceSelect]);

  return (
    <div className="flex flex-col gap-4">
      <div ref={mapRef} className="h-[400px] w-full rounded border"></div>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            onChange={(e) => setPlace(e.target.value)}
            value={place}
            className="flex-1 rounded border p-2"
            placeholder="Enter a location"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchPlace(e);
              }
            }}
          />
          <button
            className="rounded bg-blue-500 p-2 text-white"
            onClick={searchPlace}
          >
            Search
          </button>
        </div>
        <button
          className="rounded bg-green-500 p-2 text-white"
          onClick={getCurrentLocation}
        >
          Use Current Location
        </button>
        <button
          className="rounded bg-red-500 p-2 text-white"
          onClick={searchTimHortons}
        >
          Show Tim Hortons
        </button>
      </div>
    </div>
  );
}
