"use server";

import { getServerAxiosInstance } from "@/lib/api/axios-server";
import { CreateEventType, EventType } from "@/types/event";
import { ActivityLocationRequestType, ActivityPlaceType } from "@/types/map";
import { AxiosError } from "axios";

// Create invitation
export const createInvitation = async ({
  requestData,
}: {
  requestData: CreateEventType;
}): Promise<{
  success: boolean;
  message: string;
  data: { event: EventType };
}> => {
  try {
    const formData = new FormData();

    Object.keys(requestData).forEach((key) => {
      const value = requestData[key as keyof CreateEventType];

      if (value === undefined || value === null) {
        return;
      }

      if (key === "thumbnail") {
        if (value instanceof File) {
          formData.append(key, value.size !== 0 ? value : "");
        }

        return;
      }

      formData.append(key, String(value));
    });

    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.post(`/events`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (err) {
    if (err instanceof AxiosError) {
      throw new AxiosError(err.response?.data.message);
    } else {
      throw new Error(
        "Failed to create the event invitation. Please try again.",
      );
    }
  }
};

// Fetch locations based on activities
export const getActivityLocations = async ({
  requestData,
}: {
  requestData: ActivityLocationRequestType;
}): Promise<{
  success: boolean;
  data: ActivityPlaceType[];
}> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.post(`suggestion/venue`, requestData);

    return response.data;
  } catch (err) {
    console.error(err);
    throw new AxiosError("Failed to search locations. Please try again.");
  }
};
