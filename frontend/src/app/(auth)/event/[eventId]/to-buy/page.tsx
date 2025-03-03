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
  totalSpend: BudgetDetailType["totalSpend"];
}> {
  try {
    const isHost = await checkIsHost(eventId);
    if (!isHost) redirect(`/event/${eventId}`);

    const ThingsToBuyResponse = await getThingsToBuy(eventId);
    const thingsToBuy = ThingsToBuyResponse.thingsToBuy;

    const budgetResponse = await getThingsToBuyBudget(eventId);
    const remainBudget = budgetResponse.remainBudget;
    const totalSpend = budgetResponse.totalSpend;
    const budget = budgetResponse.budget;

    return {
      itemsList: thingsToBuy,
      budget,
      remainBudget,
      totalSpend,
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
  const { itemsList, budget, remainBudget, totalSpend } =
    await fetchItemsData(eventId);

  // If the budget is not set, redirect to the create budget page
  if (budget <= 0) {
    redirect(`/event/${eventId}/to-buy/budget/create`);
  }

  if (!itemsList) {
    notFound();
  }

  return (
    <section className="space-y-4">
      <div>
        <BreadcrumbNavigation
          path={`/event/${eventId}`}
          previousPageName="Event Home"
        />
        <h1 className="text-xl font-bold">Things to buy</h1>
      </div>
      <BudgetOverview
        itemsList={itemsList}
        budget={budget}
        eventId={eventId}
        remainBudget={remainBudget}
        totalSpend={totalSpend}
      />
      <div className="flex justify-end">
        <Link href={`/event/${eventId}/to-buy/create`}>
          <Button
            type="button"
            className="mt-4 h-12 rounded-full border border-primary bg-white px-12 text-base font-bold text-primary hover:text-white"
          >
            Add item
          </Button>
        </Link>
      </div>
    </section>
  );
}
