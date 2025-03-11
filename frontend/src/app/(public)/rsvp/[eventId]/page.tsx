import EventInformation from "@/components/features/rsvp/event-information";
import RsvpForm from "@/components/features/rsvp/rsvp-form";
import { getEventInformation } from "@/lib/api/event";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const getEventUrl = (eventId: string) => `${baseUrl}/rsvp/${eventId}`;

  const response = await getEventInformation(eventId);

  return {
    title: response.event.title,
    description: `Join us for a fun event: ${response.event.title}!`,
    openGraph: {
      title: response.event.title,
      description: `A special event "${response.event.title}" is happening soon. We'd love to see you there!`,
      images: [{ url: response.event.thumbnailUrl, alt: "Oiwai" }],
      url: getEventUrl(eventId),
      type: "website",
      siteName: "Oiwai",
    },
  };
}

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

  return (
    <section
      className="max-w-md pb-3 md:mx-auto"
      style={{ backgroundColor: eventData.theme }}
    >
      <EventInformation event={eventData} />
      <RsvpForm />
    </section>
  );
};

export default RSVP;
