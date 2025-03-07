import Post from "@/components/features/event/album/post";
import BreadcrumbNavigation from "@/components/features/event/breadcrumb-navigation";

export default async function page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <section>
      <BreadcrumbNavigation
        path={`/event/${eventId}/album`}
        previousPageName="Album"
      />
      <Post eventId={eventId} />
    </section>
  );
}
