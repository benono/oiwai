import EventDetail from "@/components/features/event/event-detail";
import MenuIcon from "@/components/features/event/menu-icon";
import { MENU_LIST } from "@/constants/icons";
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
    <section className="space-y-8">
      {eventData ? <EventDetail eventData={eventData} /> : <p>Loading...</p>}
      <div className="grid grid-cols-4 grid-rows-2 gap-4">
        {MENU_LIST.map((menu) => (
          <MenuIcon key={menu.path} iconDetail={menu} eventId={eventId} />
        ))}
      </div>
    </section>
  );
}
