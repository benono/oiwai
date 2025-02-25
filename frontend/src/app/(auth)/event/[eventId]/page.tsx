import EventDetail from "@/components/features/event/event-detail";
import { getEventInformation } from "@/lib/api/event";
import { notFound } from "next/navigation";

export default async function EventHome({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  let eventData = null;
  const { eventId } = await params;

  try {
    const response = await getEventInformation(eventId);
    eventData = response.event;
  } catch (err) {
    console.error(err);
    notFound();
  }

  return (
    <section>
      {eventData ? <EventDetail eventData={eventData} /> : <p>Loading...</p>}
    </section>
  );
}
