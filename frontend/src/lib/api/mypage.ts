import { MyPageEventReturnType } from "@/types/event";
import { getServerAxiosInstance } from "./axios-server";

// Fetch event information
export const getMyPageEventInfo = async (): Promise<MyPageEventReturnType> => {
  try {
    const axiosInstance = await getServerAxiosInstance();
    const response = await axiosInstance.get(`/me/events`);
    return response.data;
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message || "Event not found");
    } else {
      throw new Error(String(err));
    }
  }
};
