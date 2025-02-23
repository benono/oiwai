import { MyPageEventType } from "@/types/event";
// import { useAuthAxios } from "./axios-client";

// Fetch event information
export const getMyPageEventInfo = async (): Promise<MyPageEventType> => {
  try {
    // TODO: Uncomment when integrating with backend
    // const axiosInstance = await getServerAxiosInstance();
    // const response = await axiosInstance.get(`/me/events`);
    // return response.data;

    return {
      // Dummy Data
      events: [
        {
          id: "12345",
          title: "Emily's Birthday Party🚀",
          thumbnailUrl: "/images/sample-thumbnail.png",
          startTime: new Date("2025-03-01T14:00:00Z"),
          endTime: new Date("2025-03-01T16:00:00Z"),
          isHost: true,
        },
        {
          id: "123456",
          title: "Ema's Birthday Party🪅",
          thumbnailUrl: "/images/sample-thumbnail.png",
          startTime: new Date("2026-03-01T14:00:00Z"),
          endTime: new Date("2026-03-01T16:00:00Z"),
          isHost: false,
        },
      ],
    };
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message || "Event not found");
    } else {
      throw new Error(String(err));
    }
  }
};
