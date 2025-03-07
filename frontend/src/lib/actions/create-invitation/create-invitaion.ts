import { getServerAxiosInstance } from "@/lib/api/axios-server";
import { CreateEventType } from "@/types/event";

import { AxiosError } from "axios";

type CreateEventRequestType = {
  event: CreateEventType;
  thumbnail: File;
};

// Create invitation
export const createInvitation = async ({
  requestData,
}: {
  requestData: CreateEventRequestType;
}): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.post(`/events`, {
      event: requestData.event,
      thumbnail: requestData.thumbnail,
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
