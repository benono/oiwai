import { getEventInfo } from "@/lib/api/event";
import { EventType } from "@/types/event";
import Image from "next/image";
import { notFound } from "next/navigation";

type EventInformationProps = {
  id: string;
};

const formatDateTime = (
  date: Date,
  options: Intl.DateTimeFormatOptions,
): string => {
  return new Intl.DateTimeFormat("en-US", options).format(date);
};

const EventInformation = async ({ id }: EventInformationProps) => {
  const response = await getEventInfo(id);

  if (!response) {
    notFound();
  }

  const event = response as EventType;

  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  const timeFormatOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return (
    <section className="w-full space-y-4">
      <Image
        src={event.event.thumbnail}
        width={200}
        height={200}
        alt="thumbnail"
        className="w-full"
      />
      <div className="space-y-2 px-4">
        <h1 className="text-2xl font-bold">{event.event.title}</h1>
        <div>
          <p className="font-semibold">
            {formatDateTime(event.event.startTime, dateFormatOptions)}
          </p>
          <p className="text-sm font-medium">
            {formatDateTime(event.event.startTime, timeFormatOptions)} - 
            {formatDateTime(event.event.endTime, timeFormatOptions)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default EventInformation;

