import BreadcrumbNavigation from "@/components/features/event/breadcrumb-navigation";
import BudgetForm from "@/components/features/event/to-buy/budget-form";
import { checkIsHost } from "@/lib/api/event";
import { redirect } from "next/navigation";

export default async function CreateBudget({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const isHost = await checkIsHost(eventId);
  if (!isHost) redirect(`/event/${eventId}`);

  return (
    <section className="space-y-4">
      <div>
        <BreadcrumbNavigation
          path={`/event/${eventId}`}
          previousPageName="Event Home"
        />
        <h1 className="text-xl font-bold">
          Create a shopping list with your budget
        </h1>
        <p className="font-sm text-textSub">
          Create a shopping list for the event.
        </p>
      </div>
      <div></div>
      <BudgetForm eventId={eventId} />
    </section>
  );
}
