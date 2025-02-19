import { getEventInfo } from "@/lib/api/event";
import { EventType } from "@/types/event";
import Image from "next/image";

const EventInformation = async() => {
  const response = await getEventInfo('1')

const formatDate = (response:EventType): string => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(response.event.startTime);
};

const formatStartTime = (response: EventType): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(response.event.startTime);
};

const formatEndTime = (response: EventType): string => {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(response.event.startTime);
};

  return (
    <section className="w-full space-y-4">
      <Image
        src={response.event.thumbnail}
        width={200}
        height={200}
        alt="thumbnail"
        className="w-full"
      />
      <div className="space-y-2 px-4">
        <h1 className="text-2xl font-bold">{response.event.title}</h1>
        <div>
          <p className="font-semibold">{formatDate(response)}</p>
          <p className="text-sm font-medium">
            {formatStartTime(response)} -{formatEndTime(response)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default EventInformation;

