"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { updatePurchaseStatus } from "@/lib/actions/event/to-buy";
import { showErrorToast } from "@/lib/toast/toast-utils";
import { BudgetDetailType, BudgetType, ShoppingItemType } from "@/types/to-buy";
import { ChevronRightIcon, PencilLineIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type BudgetOverviewProps = {
  thingsToBuy: ShoppingItemType[];
  budget: BudgetType;
  eventId: string;
  remainBudget: BudgetDetailType["remainBudget"];
  totalSpend: BudgetDetailType["totalSpend"];
};

export default function BudgetOverview({
  thingsToBuy,
  budget,
  eventId,
  totalSpend,
  remainBudget,
}: BudgetOverviewProps) {
  const router = useRouter();

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
    <section className="space-y-4">
      <div className="space-y-2 rounded-md border-0.2 border-gray-300 bg-background p-4 shadow-sm">
        <div className="flex w-full flex-col gap-3">
          <p className="text-sm font-semibold">Budget remain</p>
          <div className="mx-auto flex items-center justify-center gap-2">
            <div className="flex items-end">
              <p className="self-center text-2xl font-semibold">$&nbsp;</p>
              <p
                className={`text-4xl font-bold ${
                  remainBudget < 0 ? "text-error" : "text-primary"
                }`}
              >
                {remainBudget}
              </p>
              <p className="text-2xl font-semibold">/</p>
              <p className="text-2xl font-semibold">{budget}</p>
            </div>
            <Link
              href={`/event/${eventId}/to-buy/budget/edit`}
              className="flex w-full justify-between self-end"
            >
              <Button className="h-8 w-8 rounded-full bg-textSub/20 text-textSub shadow-none hover:bg-textSub/20 hover:opacity-70">
                <PencilLineIcon />
              </Button>
            </Link>
          </div>
          <p className="text-center text-sm font-medium text-error">
            {remainBudget < 0 ? "It looks like you're over budget." : ""}
          </p>
        </div>
        <div className="w-full space-y-1">
          <p className="text-sm font-semibold">Total spend</p>
          <div className="flex rounded-md bg-backgroundSub p-2">
            <p className="mx-auto text-lg font-semibold">${totalSpend}</p>
          </div>
        </div>
      </div>
      <ul>
        {thingsToBuy.map((item) => (
          <li key={item.id} className="flex items-center py-3">
            <Button
              variant="ghost"
              onClick={() => handleTogglePurchased(item.id)}
              className="flex cursor-pointer items-center gap-2 p-0 hover:bg-transparent hover:opacity-75"
            >
              {item.isPurchase ? (
                <Image
                  src="/images/checked.svg"
                  width={20}
                  height={20}
                  alt="icon for item checked"
                />
              ) : (
                <Image
                  src="/images/unchecked.svg"
                  width={20}
                  height={20}
                  alt="icon for item unchecked"
                />
              )}
              <p className="text-base font-medium">{item.item}</p>
            </Button>
            <Link
              href={`/event/${eventId}/to-buy/${item.id}/edit`}
              className="flex flex-grow items-center justify-end gap-2"
            >
              <span className="font-medium">
                {item.price > 0 ? `$${item.price}` : ""}
                {item.quantity > 0 ? " × " : ""}
                {item.quantity > 0 && item.quantity}
              </span>
              <ChevronRightIcon size={16} className="text-gray-600" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
