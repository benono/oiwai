import BreadcrumbNavigation from "@/components/features/event/breadcrumb-navigation";
import BudgetOverview from "@/components/features/event/to-buy/budget-overview";
import { Button } from "@/components/ui/button";
import { checkIsHost } from "@/lib/api/event";
import { getThingsToBuy } from "@/lib/api/to-buy";
import { Budget, ShoppingItem } from "@/types/to-buy";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function fetchItemsData(eventId: string): Promise<{
  itemsList: ShoppingItem[] | null;
  budget: Budget;
}> {
  try {
    const isHost = await checkIsHost(eventId);
    if (!isHost) redirect(`/event/${eventId}`);

    const response = await getThingsToBuy(eventId);
    const thingsToBuy = response.thingsToBuy;
    const budget = response.budget;

    if (!thingsToBuy || thingsToBuy.length === 0) {
      redirect(`/event/${eventId}/to-buy/budget`);
    }

    return {
      itemsList: thingsToBuy,
      budget,
    };
  } catch (err) {
    console.error(err);
    notFound();
  }
}

export default async function ThingsToBuy({
  params,
}: {
  params: { eventId: string };
}) {
  const { eventId } = params;

  // Fetch items data
  const { itemsList, budget } = await fetchItemsData(eventId);

  if (!itemsList) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <BreadcrumbNavigation
        path={`/event/${eventId}`}
        previousPageName="Event Home"
      />
      <BudgetOverview itemsList={itemsList} budget={budget} eventId={eventId} />
      <Link href={`/event/${eventId}/to-buy/create`}>
        <Button
          type="button"
          className="h-12 w-full rounded-full text-base font-bold"
        >
          Add item
        </Button>
      </Link>
    </section>
  );
}
