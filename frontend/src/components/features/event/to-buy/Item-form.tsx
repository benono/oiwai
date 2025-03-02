"use client";

import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { addItem } from "@/lib/actions/event/to-buy";
import { showErrorToast } from "@/lib/toast/toast-utils";
import { zodResolver } from "@hookform/resolvers/zod";
import router from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

type ItemFormProps = {
  eventId: string;
};

const FormSchema = z.object({
  item: z
    .string()
    .min(2, { message: "Item name must be at least 2 characters." }),
  price: z.coerce
    .number()
    .nonnegative({ message: "Price must be a non-negative number." }),
  quantity: z.coerce
    .number()
    .nonnegative({ message: "Quantity must be a non-negative number." }),
});

export default function ItemForm({ eventId }: ItemFormProps) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      item: "",
      price: 0,
      quantity: 0,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const requestData = { ...data, eventId };
      const response = await addItem({ requestData, eventId });
      if (response?.success) {
        router.push(`/event/${eventId}/timeline`);
      }
    } catch (err) {
      showErrorToast(toast, err, "Failed to add item. Please try again.");
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="item"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">
                Item Name <span className="text-red-500">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Enter item name"
                  className="h-12 font-medium placeholder:text-textSub"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Price</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter price"
                  className="h-12 font-medium placeholder:text-textSub"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Quantity</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="Enter quantity"
                  className="h-12 font-medium placeholder:text-textSub"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="h-10 w-full rounded-full text-base font-bold"
        >
          Add Item
        </Button>
      </form>
    </FormProvider>
  );
}
