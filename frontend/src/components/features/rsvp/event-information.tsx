import { getEventInfo } from "@/lib/api/event";
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
  let eventData = null;

  try {
    const response = await getEventInfo(id);
    eventData = response.event;
  } catch (err) {
    console.error(err);
    return null;
  }

  if (!eventData) {
    notFound();
  }

  // Format date and time
  const dateFormatOptions: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  // Format time
  const timeFormatOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return (
    <section className="space-y-4">
      <Image
        src={eventData.thumbnailUrl}
        width={200}
        height={200}
        alt="thumbnail"
        className="w-full"
        priority
      />
      <div className="space-y-2 px-6">
        <h1 className="text-2xl font-bold">{eventData.title}</h1>
        <div>
          <p className="font-semibold">
            {formatDateTime(eventData.startTime, dateFormatOptions)}
          </p>
          <p className="text-sm font-medium">
            {formatDateTime(eventData.startTime, timeFormatOptions)} -
            {formatDateTime(eventData.endTime, timeFormatOptions)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default EventInformation;
