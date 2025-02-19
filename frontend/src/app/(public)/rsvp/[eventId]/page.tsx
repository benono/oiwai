import EventInformation from "@/components/features/rsvp/event-information"
import RsvpForm from "@/components/features/rsvp/rsvp-form"

const RSVP = () => {
  return (
    <section className="w-full h-full max-w-screen-sm mx-auto bg-red-200">
      <EventInformation />
      <RsvpForm />
    </section>
  )
}

export default RSVP