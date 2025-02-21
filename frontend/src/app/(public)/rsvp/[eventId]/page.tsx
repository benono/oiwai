import EventInformation from "@/components/features/rsvp/event-information";
import RsvpForm from "@/components/features/rsvp/rsvp-form";
import { getEventInfo } from "@/lib/api/event";
import { notFound } from "next/navigation";

const RSVP = async ({ params }: { params: { id: string } }) => {
  let eventData = null;

  try {
    const response = await getEventInfo(params.id);
    eventData = response.event;
  } catch (err) {
    console.error(err);
    notFound();
  }

  return (
    <section className={`max-w-md pb-3 md:mx-auto bg-${eventData.theme}`}>
      <EventInformation event={eventData} />
      <RsvpForm />
    </section>
  );
};

export default RSVP;
