import BreadcrumbNavigation from "@/components/features/event/breadcrumb-navigation";
import NecessitiesForm from "@/components/features/event/necessities/necessities-form";
import ScrollToTop from "@/components/features/scroll-to-top";
import { getHostNecessitiesInfo } from "@/lib/actions/event/necessities";
import { checkIsHost } from "@/lib/api/event";
import { notFound, redirect } from "next/navigation";

export default async function page({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  let hostNecessities;

  try {
    const isHost = await checkIsHost(eventId);
    if (isHost) {
      hostNecessities = await getHostNecessitiesInfo(eventId);
    } else {
      redirect(`/event/${eventId}`);
    }
  } catch (err) {
    console.error(err);
    notFound();
  }

  return (
    <section className="grid gap-6">
      <ScrollToTop />
      <div>
        <BreadcrumbNavigation
          path={`/event/${eventId}/necessities`}
          previousPageName="Tings to bring"
        />
        <h1 className="px-4 pt-2 text-xl font-bold">Things to bring</h1>
      </div>
      <NecessitiesForm initialData={hostNecessities} />
    </section>
  );
}
