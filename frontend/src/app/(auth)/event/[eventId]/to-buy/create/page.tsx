import BreadcrumbNavigation from "@/components/features/event/breadcrumb-navigation";
import ItemForm from "@/components/features/event/to-buy/item-form"
import { getThingsToBuy } from "@/lib/api/to-buy";

export default async function Budget({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const { budget, thingsToBuy } = await getThingsToBuy(eventId);

  const breadcrumbProps = {
    path:
      budget === 0 && thingsToBuy.length === 0
        ? `/event/${eventId}`
        : `/event/${eventId}/to-buy`,
    previousPageName:
      budget === 0 && thingsToBuy.length === 0 ? "Event home" : "Things to buy",
  };

  return (
    <>
      <BreadcrumbNavigation {...breadcrumbProps} />
      <h1>Add item</h1>
      <ItemForm eventId={eventId} />
    </>
  );
}
