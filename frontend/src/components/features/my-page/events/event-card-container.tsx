import { notFound } from "next/navigation";
import EventCardList from "./event-card-list";
import { getMyPageEventInfo } from "@/lib/actions/my-page/my-page";

export default async function EventCardContainer() {
  let eventResponse;

  try {
    eventResponse = await getMyPageEventInfo();

    if(!eventResponse || !eventResponse.events) {
      notFound();
    }

    return <EventCardList events={eventResponse.events} />
  } catch (error) {
    return <EventCardList events={[]} error={error instanceof Error ? error.message : String(error)} />;

  }
}

