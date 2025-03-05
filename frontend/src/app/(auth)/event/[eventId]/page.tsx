import EventDetail from "@/components/features/event/event-detail";
import MenuIcon from "@/components/features/event/menu-icon";
import { MENU_LIST_GUEST, MENU_LIST_HOST } from "@/constants/icons";
import { getWhoIsComing } from "@/lib/actions/event/participant";
import { checkIsHost, getEventInformation } from "@/lib/api/event";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EventHome({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  let eventData = null;
  let isHost = false;
  let guests = null;
  const { eventId } = await params;

  try {
    const response = await getEventInformation(eventId);
    eventData = response.event;

    isHost = await checkIsHost(eventId);

    // Fetch guest list
    guests = await getWhoIsComing(eventId);
  } catch (err) {
    console.error(err);
    notFound();
  }

  return (
    <section className="space-y-8">
      {isHost ? "You are a host" : "You are a guest"}
      {eventData ? <EventDetail eventData={eventData} /> : <p>Loading...</p>}

      {/* TODO: Display the review icon after the event has ended. */}
      <section className="grid grid-cols-4 gap-4">
        {(isHost ? MENU_LIST_HOST : MENU_LIST_GUEST).map((menu) => (
          <MenuIcon key={menu.path} iconDetail={menu} eventId={eventId} />
        ))}
      </section>
      {!isHost && (
        <section>
          <div className="flex justify-between border-b-[0.2px] border-gray-300 pb-2">
            <h2 className="font-semibold">Who is coming</h2>
            <p className="text-sm font-medium text-textSub">
              <span>{guests.length}</span> Going
            </p>
          </div>
          <div className="flex w-full flex-col">
            <ul className="grid grid-cols-5 gap-2 pt-4">
              {guests.map(({ id, name, profileImageUrl }) => (
                <li
                  className="grid h-auto w-16 justify-items-center gap-2"
                  key={id}
                >
                  <Image
                    src={profileImageUrl}
                    width={64}
                    height={64}
                    alt={name}
                    className="h-14 w-14 rounded-full object-cover"
                  />
                  <p className="line-clamp-2 w-full break-words text-center text-sm font-medium">
                    {name}
                  </p>
                </li>
              ))}
            </ul>
            <Link
              href={`/event/${eventId}/guests`}
              className="ml-auto text-sm font-semibold text-accentBlue hover:text-accentBlue/60"
            >
              See all
            </Link>
          </div>
        </section>
      )}

      {/* TODO: Allow the host to upload photos */}
      <section>
        <p className="text-center text-sm font-medium">
          Share a photo that makes this event even more special!
        </p>
      </section>
    </section>
  );
}
