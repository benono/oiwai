import BreadcrumbNavigation from "@/components/features/event/breadcrumb-navigation";
import ItemForm from "@/components/features/event/to-buy/item-form";
import { getThingsToBuyBudget } from "@/lib/api/to-buy";

export default async function Budget({
  params,
  searchParams,
}: {
  params: Promise<{ eventId: string }>;
  searchParams: Promise<{ budget?: number }>;
}) {
  const { eventId } = await params;
  const { budget } = await searchParams;
  const response = await getThingsToBuyBudget(eventId);

  let remainBudget;
  let isInitialCreate = false;

  if (budget) {
    remainBudget = budget;
    isInitialCreate = true;
  } else {
    remainBudget = response.budget;
  }

  const breadcrumbProps = {
    path: budget ? `/event/${eventId}` : `/event/${eventId}/to-buy`,
    previousPageName: budget ? "Event home" : "Things to buy",
  };

  return (
    <>
      <BreadcrumbNavigation {...breadcrumbProps} />
      <h1>Add item</h1>
      <ItemForm
        eventId={eventId}
        remainBudget={remainBudget}
        isInitialCreate={isInitialCreate}
      />
    </>
  );
}
