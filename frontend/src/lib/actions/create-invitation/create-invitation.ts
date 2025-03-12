"use server";

import { getServerAxiosInstance } from "@/lib/api/axios-server";
import { CreateEventType, EventType } from "@/types/event";
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

      if (key === "thumbnail" && value instanceof File) {
        if (value && value.size !== 0) {
          formData.append("thumbnail", value);
        } else {
          formData.append("thumbnail", "");
        }
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
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
