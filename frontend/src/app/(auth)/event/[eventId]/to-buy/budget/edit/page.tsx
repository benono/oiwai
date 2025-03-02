import BreadcrumbNavigation from "@/components/features/event/breadcrumb-navigation";
import BudgetForm from "@/components/features/event/to-buy/budget-form";
import { getThingsToBuy } from "@/lib/api/to-buy";
import { notFound } from "next/navigation";

export default async function CreateBudget({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  let budget;
  try {
    const response = await getThingsToBuy(eventId);
    budget = response.budget;
  } catch (err) {
    console.error(err);
    notFound();
  }

  return (
    <>
      <BreadcrumbNavigation
        path={`/event/${eventId}/to-buy`}
        previousPageName="Things to buy"
      />
      <div>
        <h1>Edit budget</h1>
      </div>
      <BudgetForm eventId={eventId} budget={budget} />
    </>
  );
}
