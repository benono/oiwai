import { Button } from "@/components/ui/button";
import { ACTIVITY_LIST } from "@/constants/activities";
import { useToast } from "@/hooks/use-toast";
import { getActivityLocations } from "@/lib/actions/create-invitation/create-invitation";
import { useMapStore } from "@/lib/store/use-map-store";
import { showErrorToast } from "@/lib/toast/toast-utils";
import { ActivityPlaceType } from "@/types/event";
import { Info, MapPin, RefreshCcw, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type ActivitiesProps = {
  addMarkers: (places: Place[]) => void;
  placeId: string;
  setPlaceId: (id: string) => void;
  onPlaceSelect: (place: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  setPlace: (id: string) => void;
};

interface Place {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  address: string;
  type: string;
}

const RatingStars = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const fullStars = Math.round(rating);
  const emptyStars = totalStars - fullStars;

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, index) => (
        <Star
          key={`full-${index}`}
          className="text-primary"
          size={16}
          fill="currentColor"
        />
      ))}
      {[...Array(emptyStars)].map((_, index) => (
        <Star
          key={`empty-${index}`}
          className="text-primary"
          size={16}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
};

export default function Activities({
  addMarkers,
  placeId,
  setPlaceId,
  onPlaceSelect,
  setPlace,
}: ActivitiesProps) {
  const [isShowActivityList, setIsShowActivityList] = useState<boolean>(false);
  const { toast } = useToast();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const swipeHandleRef = useRef<HTMLDivElement | null>(null);
  const startY = useRef<number | null>(null);
  const isMouseDown = useRef<boolean>(false);
  const [selectedPlace, setSelectedPlace1] = useState<ActivityPlaceType | null>(
    null,
  );
  const { suggestedLocations, setSuggestedLocations } = useMapStore();
  const activityListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setIsShowActivityList(true);

    if (placeId) {
      const foundPlace = suggestedLocations.find(
        (place) => place.place_id === placeId,
      );

      setSelectedPlace1(foundPlace || null);
    }
  }, [placeId]);

  useEffect(() => {
    if (isShowActivityList && activityListRef.current) {
      activityListRef.current.scrollTop = 0;
    }
  }, [isShowActivityList]);

  const handleToggleActivityList = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsShowActivityList((prev) => !prev);
    resetPageScroll();
  };

  const handleSwipeUp = () => {
    setIsShowActivityList(true);
  };

  const handleSwipeDown = () => {
    setIsShowActivityList(false);
  };

  const resetPageScroll = () => {
    document.body.style.overflow = "";
  };

  // Swipe handling for mobile
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!swipeHandleRef.current?.contains(e.target as Node)) return; // Disable swipe within the activity list
    startY.current = e.touches[0].clientY;
    document.body.style.overflow = "hidden";
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!startY.current) return;
    const deltaY = startY.current - e.touches[0].clientY;

    if (Math.abs(deltaY) > 10) {
      e.preventDefault(); // Disable page scrolling if swiped more than 10px
    }

    if (deltaY > 30) {
      handleSwipeUp();
    } else if (deltaY < -30) {
      handleSwipeDown();
    }
  };

  const handleTouchEnd = () => {
    startY.current = null;
    resetPageScroll();
  };

  // Drag handling for desktop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!swipeHandleRef.current?.contains(e.target as Node)) return; // Disable swipe within the activity list
    isMouseDown.current = true;
    startY.current = e.clientY;
    document.body.style.overflow = "hidden";
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isMouseDown.current || startY.current === null) return;
    const deltaY = startY.current - e.clientY;

    if (deltaY > 30) {
      handleSwipeUp();
    } else if (deltaY < -30) {
      handleSwipeDown();
    }
  };

  const handleMouseUp = () => {
    isMouseDown.current = false;
    startY.current = null;
    resetPageScroll(); // Restore page scrolling
  };

  // Add mouse event listeners when the component mounts and remove them on unmount
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleActivitySelect = async (activity: string) => {
    try {
      const response = await getActivityLocations({
        requestData: {
          activity_type: activity,
          latitude: 49.2827,
          longitude: -123.1169,
          radius: 30000,
        },
      });

      if (!response?.success) {
        throw new Error();
      }

      if (response.data) {
        const places = response.data.map((value) => {
          return {
            id: value.place_id,
            name: value.name,
            location: { lat: value.location.lat, lng: value.location.lng },
            address: value.location.address,
            type: value.activityType,
          };
        });

        setSuggestedLocations(response.data);
        setIsShowActivityList(false);
        return addMarkers(places);
      }
    } catch (err) {
      if (err instanceof Error) {
        showErrorToast(toast, err, err.message);
      } else {
        showErrorToast(
          toast,
          err,
          "An error occurred while processing your request. Please try again.",
        );
      }
    }
  };

  return (
    <div
      ref={drawerRef}
      className={`absolute bottom-0 w-full rounded-tl-xl rounded-tr-xl bg-background p-4 pb-0 transition-all duration-500 ease-in-out ${
        isShowActivityList ? "h-[300px]" : "h-[64px]"
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        ref={swipeHandleRef}
        className="cursor-grab select-none"
        onClick={handleToggleActivityList}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div className="relative w-full">
          <div className="mx-auto h-1 w-14 cursor-grab rounded-md bg-gray-400" />
        </div>
        <div className="sticky top-0 z-10 mt-1 flex items-center justify-between bg-background">
          <p className="text-xl font-bold">Activities</p>
          <button
            className="flex items-center justify-between gap-2 rounded-md bg-accentGreen px-2 py-1 font-semibold text-white hover:bg-accentGreen/70"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsShowActivityList(true);
              setPlaceId("");
              resetPageScroll();
            }}
          >
            <RefreshCcw size={16} />
            <p className="text-sm font-bold">Change</p>
          </button>
        </div>
      </div>
      {placeId && selectedPlace ? (
        <div
          ref={activityListRef}
          className={`mt-2 overflow-hidden rounded-lg border border-textBorderLight bg-white px-4 py-5 transition-all duration-500 ease-in-out ${
            isShowActivityList
              ? "max-h-[220px] overflow-y-auto"
              : "max-h-0 opacity-0"
          }`}
        >
          <Image
            src={selectedPlace.photos[0]}
            alt={selectedPlace.name}
            width={400}
            height={400}
            className="mb-3 h-24 w-full rounded-md object-cover"
          />
          <div>
            <p className="text-lg font-bold">{selectedPlace.name}</p>
            <div className="flex gap-2">
              <div>
                <p className="text-xs font-bold">{selectedPlace.rating}</p>
              </div>
              <RatingStars rating={selectedPlace.rating ?? 0} />
              <p className="text-xs font-bold">
                ({selectedPlace.userRatingsTotal})
              </p>
            </div>
          </div>
          <div className="mt-3 space-y-4 rounded-lg bg-textBorderLight px-2 py-4">
            <div className="">
              <div className="flex items-center gap-1 uppercase text-accentGreen">
                <MapPin size={16} />
                <p className="font-bold text-accentGreen">address</p>
              </div>
              <p className="text-sm font-medium text-gray-600">
                {selectedPlace.location.address}
              </p>
            </div>
            {(selectedPlace.openingHours ||
              selectedPlace.website ||
              selectedPlace.phone) && (
              <div className="space-y-2">
                <div className="flex items-center gap-1 uppercase text-accentGreen">
                  <Info size={16} />
                  <p className="font-bold text-accentGreen">information</p>
                </div>
                {selectedPlace.openingHours && (
                  <div className="space-y-1">
                    <p className="text-sm font-bold">Opening hours</p>
                    {selectedPlace.openingHours?.map((day, index) => {
                      return (
                        <p
                          key={index}
                          className="text-sm font-medium text-gray-600"
                        >
                          {day}
                        </p>
                      );
                    })}
                  </div>
                )}
                {selectedPlace.website && (
                  <div>
                    <p className="text-sm font-bold">Web site</p>
                    <a
                      href={selectedPlace.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-words text-sm font-bold text-accentBlue underline hover:text-accentBlue/70"
                    >
                      {selectedPlace.website}
                    </a>
                  </div>
                )}
                {selectedPlace.phone && (
                  <div>
                    <p className="text-sm font-bold">Phone number</p>
                    <p className="text-sm font-medium">{selectedPlace.phone}</p>
                  </div>
                )}
              </div>
            )}
          </div>
          <Button
            className="left-15 absolute bottom-2 h-10 w-5/6 rounded-full border border-primary bg-white py-3 font-bold text-primary shadow-sm hover:bg-primary hover:text-white"
            onClick={(e) => {
              e.preventDefault();
              onPlaceSelect({
                latitude: selectedPlace.location.lat,
                longitude: selectedPlace.location.lng,
                address: selectedPlace.location.address,
              });
              setPlace(selectedPlace.location.address);
              setIsShowActivityList(false);
            }}
          >
            Set Here
          </Button>
        </div>
      ) : (
        <ul
          className={`mt-4 grid grid-cols-3 gap-2 overflow-y-auto transition-all duration-500 ease-in-out ${
            isShowActivityList ? "max-h-[220px]" : "max-h-0"
          }`}
        >
          {ACTIVITY_LIST.map((activity, index) => (
            <li
              key={index}
              className="group relative flex h-16 cursor-pointer items-center justify-center p-3 transition-all duration-300 ease-in-out"
              onClick={() => handleActivitySelect(activity.name)}
            >
              <Image
                src={activity.image}
                alt={activity.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="rounded-md object-cover"
              />
              <div className="absolute inset-0 rounded-md bg-black/40 opacity-70"></div>
              <p className="z-10 whitespace-normal text-center text-sm font-bold text-white transition-all duration-300 ease-in-out group-hover:scale-105">
                {activity.name}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
