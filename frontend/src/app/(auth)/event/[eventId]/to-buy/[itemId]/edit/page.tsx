import BreadcrumbNavigation from "@/components/features/event/breadcrumb-navigation";
import ItemDeleteButton from "@/components/features/event/to-buy/item-delete-button";
import ItemForm from "@/components/features/event/to-buy/item-form";

export default async function EditItem({
  params,
}: {
  params: Promise<{ eventId: string; itemId: string }>;
}) {
  const { eventId, itemId } = await params;

  return (
    <>
      <BreadcrumbNavigation
        path={`/event/${eventId}/to-buy`}
        previousPageName="Things to buy"
      />
      <div>
        <h1>Edit item</h1>
      </div>
      <ItemDeleteButton eventId={eventId as string} itemId={itemId as string} />
      <ItemForm eventId={eventId as string} />
    </>
  );
}
