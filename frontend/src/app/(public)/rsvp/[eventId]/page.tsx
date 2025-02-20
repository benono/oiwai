import EventInformation from "@/components/features/rsvp/event-information";
import RsvpForm from "@/components/features/rsvp/rsvp-form";

const RSVP = ({ params }: { params: { id: string } }) => {
  return (
    <section className="mx-auto h-full w-full max-w-[375px]">
      <EventInformation id={params.id} />
      <RsvpForm />
    </section>
  );
};

export default RSVP;
