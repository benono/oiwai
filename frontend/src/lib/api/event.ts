import { EventType } from "@/types/event";

// Fetch event information
export const getEventInfo = async (eventId: string): Promise<EventType> => {
  try {
    // const axiosInstance = await getServerAxiosInstance();
    // const response = await axiosInstance.fetch(`events/${eventId}`);

    return {
      // Dummy Data
      event: {
        id: "12345",
        title: "Emily’s Birthday Party🚀",
        thumbnail: "/sample-thumbnail.png",
        startTime: new Date("2025-03-01T14:00:00Z"),
        endTime: new Date("2025-03-01T16:00:00Z"),
      },
    };
  } catch (err) {
    alert(err); // TODO: use toast
  }
};
