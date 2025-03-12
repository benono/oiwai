import EventInformation from "@/components/features/rsvp/event-information";
import RsvpForm from "@/components/features/rsvp/rsvp-form";
import { THEME_BACKGROUND_COLORS } from "@/constants/theme-colors";
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

  const getBackgroundColor = (theme: string): string => {
    return THEME_BACKGROUND_COLORS[theme] || THEME_BACKGROUND_COLORS.default;
  };

  return (
    <section
      className="max-w-md pb-3 md:mx-auto"
      style={{ backgroundColor: getBackgroundColor(eventData.theme) }}
    >
      <EventInformation event={eventData} />
      <RsvpForm theme={eventData.theme} />
    </section>
  );
};

export default RSVP;
