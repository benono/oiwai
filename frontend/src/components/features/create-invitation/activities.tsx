import { ACTIVITY_LIST } from "@/constants/activities";
import { useToast } from "@/hooks/use-toast";
import { getActivityLocations } from "@/lib/actions/create-invitation/create-invitation";
import { showErrorToast } from "@/lib/toast/toast-utils";
import { RefreshCcw } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

type ActivitiesProps = {
  addMarkers: (places: Place[]) => void;
  placeId: string;
  setPlaceId: (id: string) => void;
};

interface Place {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  address: string;
  type: string;
}

export default function Activities({
  addMarkers,
  placeId,
  setPlaceId,
}: ActivitiesProps) {
  const [isShowActivityList, setIsShowActivityList] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsShowActivityList(true);
  }, [placeId]);

  const handleToggleActivityList = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsShowActivityList((prev) => !prev);
  };

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
      className={`absolute bottom-0 w-full rounded-tl-xl rounded-tr-xl bg-background p-4 transition-all duration-500 ease-in-out ${
        isShowActivityList ? "h-[200px]" : "h-[72px]"
      }`}
    >
      <div className="h-2 w-full" onClick={handleToggleActivityList}>
        <div className="mx-auto h-1 w-14 cursor-pointer rounded-md bg-gray-400" />
      </div>
      <div className="sticky top-0 z-10 mt-1 flex items-center justify-between bg-background">
        <p className="text-xl font-bold">Activities</p>
        <button
          className="flex items-center justify-between gap-2 rounded-md bg-accentGreen px-2 py-1 font-semibold text-white hover:bg-accentGreen/70"
          onClick={(e) => {
            e.preventDefault();
            setIsShowActivityList(true);
            setPlaceId("");
          }}
        >
          <RefreshCcw size={16} />
          <p className="text-sm font-bold">change</p>
        </button>
      </div>
      {placeId ? (
        <div
          className={`mt-4 overflow-y-auto transition-all duration-500 ease-in-out ${
            isShowActivityList ? "max-h-[120px]" : "max-h-0"
          }`}
        >
          Place detail
          {/* TODO: display place information */}
          {/* TODO: display a button */}
        </div>
      ) : (
        <ul
          className={`mt-4 grid grid-cols-3 gap-2 overflow-y-auto transition-all duration-500 ease-in-out ${
            isShowActivityList ? "max-h-[120px]" : "max-h-0"
          }`}
        >
          {ACTIVITY_LIST.map((activity, index) => (
            <li
              key={index}
              className="relative flex h-16 cursor-pointer items-center justify-center"
              onClick={() => handleActivitySelect(activity.name)}
            >
              <Image
                src={activity.image}
                alt={activity.name}
                fill
                className="rounded-md object-cover"
              />
              <div className="absolute inset-0 rounded-md bg-black/40"></div>
              <p className="z-10 text-sm font-bold text-white">
                {activity.name}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
