import BreadcrumbNavigation from "@/components/features/event/breadcrumb-navigation";
import BudgetForm from "@/components/features/event/to-buy/budget-form";

export default async function CreateBudget({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  return (
    <>
      <BreadcrumbNavigation
        path={`/event/${eventId}`}
        previousPageName="Event Home"
      />
      <div>
        <h1>Create a shopping list with your budget</h1>
        <p>Create a shopping list for the event.</p>
      </div>
      <BudgetForm eventId={eventId} />
    </>
  );
}
