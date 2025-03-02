import BreadcrumbNavigation from "@/components/features/event/breadcrumb-navigation";
import BudgetOverview from "@/components/features/event/to-buy/budget-overview";
import { Button } from "@/components/ui/button";
import { checkIsHost } from "@/lib/api/event";
import { getThingsToBuy, getThingsToBuyBudget } from "@/lib/api/to-buy";
import { BudgetDetailType, BudgetType, ShoppingItemType } from "@/types/to-buy";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

async function fetchItemsData(eventId: string): Promise<{
  itemsList: ShoppingItemType[] | null;
  budget: BudgetType;
  remainBudget: BudgetDetailType["remainBudget"];
  totalspend: BudgetDetailType["totalspend"];
}> {
  try {
    const isHost = await checkIsHost(eventId);
    if (!isHost) redirect(`/event/${eventId}`);

    const ThingsToBuyResponse = await getThingsToBuy(eventId);
    const thingsToBuy = ThingsToBuyResponse.thingsToBuy;
    const budget = ThingsToBuyResponse.budget;

    const budgetResponse = await getThingsToBuyBudget(eventId);
    const remainBudget = budgetResponse.remainBudget;
    const totalspend = budgetResponse.totalspend;

    if (!thingsToBuy || thingsToBuy.length === 0) {
      redirect(`/event/${eventId}/to-buy/budget/create`);
    }

    return {
      itemsList: thingsToBuy,
      budget,
      remainBudget,
      totalspend,
    };
  } catch (err) {
    console.error(err);
    notFound();
  }
}

export default async function ThingsToBuy({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  // Fetch items data
  const { itemsList, budget, remainBudget, totalspend } =
    await fetchItemsData(eventId);

  if (!itemsList) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <BreadcrumbNavigation
        path={`/event/${eventId}`}
        previousPageName="Event Home"
      />
      <BudgetOverview
        itemsList={itemsList}
        budget={budget}
        eventId={eventId}
        remainBudget={remainBudget}
        totalspend={totalspend}
      />
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
