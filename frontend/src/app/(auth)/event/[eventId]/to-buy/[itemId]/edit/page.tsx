import BreadcrumbNavigation from "@/components/features/event/breadcrumb-navigation";
import ItemDeleteButton from "@/components/features/event/to-buy/item-delete-button";
import ItemForm from "@/components/features/event/to-buy/item-form";
import { checkIsHost } from "@/lib/api/event";
import { getThingToBuy } from "@/lib/api/to-buy";
import { notFound, redirect } from "next/navigation";

export default async function EditItem({
  params,
}: {
  params: Promise<{ eventId: string; itemId: number }>;
}) {
  const { eventId, itemId } = await params;

  try {
    const isHost = await checkIsHost(eventId);
    if (!isHost) redirect(`/event/${eventId}`);

    const response = await getThingToBuy(eventId, itemId);
    const thingToBuy = response.thingToBuy.thingToBuy;
    const remainBudget = response.remainBudget;

    return (
      <>
        <BreadcrumbNavigation
          path={`/event/${eventId}/to-buy`}
          previousPageName="Things to buy"
        />
        <div>
          <h1>Edit item</h1>
        </div>
        <ItemDeleteButton eventId={eventId} itemId={itemId} />
        <ItemForm
          eventId={eventId}
          thingToBuy={thingToBuy}
          remainBudget={remainBudget}
        />
      </>
    );
  } catch (err) {
    console.error(err);
    notFound();
  }
}
