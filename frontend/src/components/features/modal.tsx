"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FormEvent, ReactNode, useState } from "react";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { showErrorToast } from "@/lib/toast/toast-utils";
import { useClerk } from "@clerk/nextjs";

type ModalProps = {
  trigger: ReactNode;
  title: string;
  description?: string;
  button?: ReactNode;
  deleteAction: (id?: string) => Promise<{ success: boolean; message: string }>;
  id?: string;
  deleteErrorMessage: string;
};

export default function Modal({
  trigger,
  title,
  description,
  button,
  deleteAction,
  id,
  deleteErrorMessage
}: ModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {toast} = useToast()
  const { signOut } = useClerk()

  const handleDelete = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    let response;
    try {
      if (id) {
        response = await deleteAction(id);
      } else {
        response = await deleteAction();
        if(response.success) {
          signOut({ redirectUrl: '/' });
        }
      }
      if (response.success) {
        setIsOpen(false);
      }
    } catch (error) {
      if (error instanceof Error) {
        showErrorToast(toast, error.message, deleteErrorMessage);
      } else {
        showErrorToast(toast, "Failed to delete user", deleteErrorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-between gap-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full bg-white">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            className="w-full bg-error font-bold shadow-none"
            onClick={handleDelete}
          >
            {isLoading ? "Loading..." : button}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
