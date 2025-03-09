import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function EventCreated() {
  return (
    <section>
      <p className="mt-10 text-center text-2xl font-bold">
        Created your Event!
      </p>
      {/* TODO: Get an event id */}
      <Link href={`/event/3`} className="mt-6 flex">
        <Button
          type="submit"
          className="mt-16 h-12 w-full rounded-full text-base font-bold"
        >
          Prepare more detail
        </Button>
      </Link>
    </section>
  );
}
