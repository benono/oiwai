"use client";

import { updateFamilyInfo, updateUserInfo } from "@/lib/api/user";
import { PencilLineIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { FormEvent, ReactNode, useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

type PersonModalProps = {
  trigger?: ReactNode;
  title: string;
  defaultName?: string;
  defaultImage?: string;
  type: "user" | "family";
  mode: "new" | "edit";
  familyId?: string;
};

export default function PersonModal({
  trigger,
  title,
  defaultName,
  defaultImage,
  type,
  mode,
  familyId,
}: PersonModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File;
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : defaultImage;

    try {
      let response;
      if (type === "user") {
        response = await updateUserInfo({ name, profileImageUrl: imageUrl });
      } else if (familyId && type === "family") {
        response = await updateFamilyInfo({
          familyId,
          name,
          profileImageUrl: imageUrl,
        });
      }

      if (!response) {
        notFound();
      }
    } catch (err) {
      if (err instanceof Error) {
        throw new Error();
      } else {
        throw new Error(String(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button className="h-8 w-8 rounded-full bg-textSub/20 text-textSub shadow-none hover:bg-textSub/20 hover:opacity-70">
            <PencilLineIcon />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <input type="file" id="image" name="image" />
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                defaultValue={defaultName}
                name="name"
                required
              />
            </div>
          </div>
        </form>

        <DialogFooter className="flex flex-row justify-between gap-4">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full bg-white">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="w-full font-bold shadow-none">
            {isLoading
              ? "Updating..."
              : mode === "new"
                ? "Add"
                : mode === "edit"
                  ? "Update"
                  : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
