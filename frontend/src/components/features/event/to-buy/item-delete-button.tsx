"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { deleteItem } from "@/lib/actions/event/to-buy";
import { showErrorToast } from "@/lib/toast/toast-utils";
import { ShoppingItemType } from "@/types/to-buy";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "../../modal";

type ItemDeleteButtonProps = {
  eventId: string;
  itemId: ShoppingItemType["id"];
};
export default function ItemDeleteButton({
  eventId,
  itemId,
}: ItemDeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await deleteItem(eventId, itemId);

      if (response.success) {
        router.push(`/event/${eventId}/to-buy`);
      }

      return { success: false, message: "No action performed" };
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
      return { success: false, message: "An error occurred" };
    }
  };

  return (
    <Modal
      trigger={
        <Button className="h-8 w-8 rounded-full bg-textSub/20 text-textSub shadow-none hover:bg-textSub/20 hover:opacity-70">
          <Trash2 size={16} />
        </Button>
      }
      title="Delete item"
      description="Are you sure you want to delete this item? This action cannot be undone."
      button="Delete"
      deleteAction={handleDelete}
      deleteErrorMessage="Failed to delete item"
      id={itemId.toString()}
    />
  );
}
