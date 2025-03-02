"use client";

import { toast } from "@/hooks/use-toast";
import { updatePurchaseStatus } from "@/lib/actions/event/to-buy";
import { showErrorToast } from "@/lib/toast/toast-utils";
import { Budget, ShoppingItem } from "@/types/to-buy";
import { useRouter } from "next/navigation";

type BudgetOverviewProps = {
  itemsList: ShoppingItem[];
  budget: Budget;
  eventId: string;
};

export default function BudgetOverview({
  itemsList,
  budget,
  eventId,
}: BudgetOverviewProps) {
  const router = useRouter();

  const thingsToBuy = itemsList ?? [];

  const calculateTotalPurchased = (items: ShoppingItem[]) => {
    return items.reduce(
      (total, item) =>
        item.isPurchase ? total + item.price * item.quantity : total,
      0,
    );
  };

  const handleTogglePurchased = async (id: string) => {
    try {
      const updatedItem = thingsToBuy.find((item) => item.id === id);
      if (!updatedItem) return;

      const isPurchase = !updatedItem.isPurchase;
      const response = await updatePurchaseStatus({
        isPurchased: isPurchase,
        eventId: eventId,
        item_id: id,
      });

      if (response?.success) {
        router.push(`/event/${eventId}/to-buy`);
      }
    } catch (err) {
      if (err instanceof Error) {
        showErrorToast(toast, err, err.message);
      } else {
        showErrorToast(
          toast,
          err,
          "An error occurred while processing your request. Please try again.",
        );
      }
    }
  };

  const totalSpendAmount = calculateTotalPurchased(thingsToBuy);
  const remainingBudget = budget - totalSpendAmount;

  return (
    <div>
      <div>
        <p>Budget: ${budget}</p>
        <p>Total spend: ${totalSpendAmount}</p>
        <p>Budget remain: ${remainingBudget}</p>
        <ul>
          {itemsList.map((item) => (
            <li key={item.id}>
              <label>
                <input
                  type="checkbox"
                  checked={item.isPurchase}
                  onChange={() => handleTogglePurchased(item.id)}
                />
                {item.item} - ${item.price} × {item.quantity}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
