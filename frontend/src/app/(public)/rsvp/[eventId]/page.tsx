import EventInformation from "@/components/features/rsvp/event-information";
import RsvpForm from "@/components/features/rsvp/rsvp-form";
import { getEventInformation } from "@/lib/api/event";
import { notFound } from "next/navigation";

const RSVP = async ({ params }: { params: Promise<{ eventId: string }> }) => {
  let eventData = null;
  const { eventId } = await params;

  try {
    const response = await getEventInformation(eventId);
    eventData = response.event;
  } catch (err) {
    console.error(err);
    notFound();
  }

  const backgroundColor =
    eventData.theme === "#F97315"
      ? "#FFFBF2"
      : eventData.theme === "#1A74A2"
        ? "#F2F7FF"
        : eventData.theme === "#7E4F8F"
          ? "#F6F2FF"
          : "#FFFBF2";

  return (
    <section
      className="max-w-md pb-3 md:mx-auto"
      style={{ backgroundColor: backgroundColor }}
    >
      <EventInformation event={eventData} />
      <RsvpForm theme={eventData.theme} />
    </section>
  );
};

export default RSVP;
