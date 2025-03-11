import { ShareLinks } from "@/components/features/rsvp/ShareLinks";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

type EventCreatedProps = {
  searchParams: {
    eventId: string;
    title: string;
    thumbnailUrl: string;
  };
};

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const getEventUrl = (eventId: string) => `${baseUrl}/rsvp/${eventId}`;

export default async function EventCreated({
  searchParams,
}: EventCreatedProps) {
  const { eventId, title, thumbnailUrl } = searchParams;
  const eventUrl = getEventUrl(eventId);

  return (
    <section>
      <p className="mb-6 mt-10 text-center text-2xl font-bold">
        Created your Event!
      </p>
      <div className="relative">
        <Image
          src={thumbnailUrl}
          alt="thumbnail"
          width={500}
          height={500}
          className="contrast-110 aspect-[2/1] w-full rounded-xl object-cover brightness-75"
          priority
        />
        <p className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
          {title}
        </p>
      </div>
      <ShareLinks eventUrl={eventUrl} />
      <Link href={`/event/${eventId}`} className="mt-6 flex">
        <Button
          type="submit"
          className="mt-8 h-12 w-full rounded-full text-base font-bold"
        >
          Prepare more detail
        </Button>
      </Link>
    </section>
  );
}
