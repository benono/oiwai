"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { updatePurchaseStatus } from "@/lib/actions/event/to-buy";
import { showErrorToast } from "@/lib/toast/toast-utils";
import { BudgetDetailType, BudgetType, ShoppingItemType } from "@/types/to-buy";
import { ChevronRightIcon, PencilLineIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BudgetOverviewProps = {
  itemsList: ShoppingItemType[];
  budget: BudgetType;
  eventId: string;
  remainBudget: BudgetDetailType["remainBudget"];
  totalspend: BudgetDetailType["totalspend"];
};

export default function BudgetOverview({
  itemsList,
  budget,
  eventId,
  totalspend,
  remainBudget,
}: BudgetOverviewProps) {
  const router = useRouter();

  const thingsToBuy = itemsList ?? [];


  const handleTogglePurchased = async (id: ShoppingItemType["id"]) => {
    try {
      const updatedItem = thingsToBuy.find((item) => item.id === id);
      if (!updatedItem) return;

      const isPurchase = !updatedItem.isPurchase;
      const response = await updatePurchaseStatus({
        eventId: eventId,
        itemId: id,
        isPurchased: isPurchase,
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

  return (
    <div>
      <div>
        <p>Budget: ${budget}</p>
        <Link
          href={`/event/${eventId}/to-buy/budget/edit`}
          className="flex w-full justify-between"
        >
          <Button className="h-8 w-8 rounded-full bg-textSub/20 text-textSub shadow-none hover:bg-textSub/20 hover:opacity-70">
            <PencilLineIcon />
          </Button>
        </Link>
        <p>Total spend: ${totalspend}</p>
        <p>Budget remain: ${remainBudget}</p>
        <ul>
          {itemsList.map((item) => (
            <li key={item.id} className="flex items-center">
              <label
                className="flex cursor-pointer items-center gap-2"
                onClick={() => {
                  handleTogglePurchased(item.id);
                }}
              >
                <input
                  type="checkbox"
                  checked={item.isPurchase}
                  onChange={() => {}}
                  className="cursor-pointer"
                />
                {item.item}
              </label>
              <Link
                href={`/event/${eventId}/to-buy/${item.id}/edit`}
                className="flex flex-grow items-center justify-end gap-2"
              >
                <span>
                  ${item.price} × {item.quantity}
                </span>
                <ChevronRightIcon size={16} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
