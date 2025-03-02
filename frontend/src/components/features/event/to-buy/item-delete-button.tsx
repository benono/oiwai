"use client";

import { Button } from "@/components/ui/button";
import { deleteItem } from "@/lib/actions/event/to-buy";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Modal from "../../modal";

type ItemDeleteButtonProps = {
  eventId: string;
  itemId: string;
};
export default function ItemDeleteButton({
  eventId,
  itemId,
}: ItemDeleteButtonProps) {
  const router = useRouter();

  const handleDelete = async () => {
    const response = await deleteItem(eventId as string, itemId as string);
    if (response.success) {
      router.push(`/event/${eventId}/to-buy`);
    }
    return { success: false, message: "No action performed" };
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
      id={itemId as string}
    />
  );
}
