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
  let response;

  try {
    response = await getEventInfo(id);
  } catch (err) {
    alert(err);
    return null;
  }

  if (!response) {
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
    <section className="w-full space-y-4">
      <Image
        src={response.thumbnailUrl}
        width={200}
        height={200}
        alt="thumbnail"
        className="w-full"
        priority
      />
      <div className="space-y-2 px-4">
        <h1 className="text-2xl font-bold">{response.title}</h1>
        <div>
          <p className="font-semibold">
            {formatDateTime(response.startTime, dateFormatOptions)}
          </p>
          <p className="text-sm font-medium">
            {formatDateTime(response.startTime, timeFormatOptions)} -
            {formatDateTime(response.endTime, timeFormatOptions)}
          </p>
        </div>
      </div>
    </section>
  );
};

export default EventInformation;
