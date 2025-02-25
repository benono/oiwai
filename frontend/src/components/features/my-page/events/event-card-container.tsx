import { getMyPageEventInfo } from "@/lib/api/mypage";
import { notFound } from "next/navigation";
import EventCardList from "./event-card-list";

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

