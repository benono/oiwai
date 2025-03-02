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
import {
  addItem,
  createThingsToBuy,
  updateItem,
} from "@/lib/actions/event/to-buy";
import { showErrorToast } from "@/lib/toast/toast-utils";
import { BudgetType, ShoppingItemType } from "@/types/to-buy";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { z } from "zod";

type ItemFormProps = {
  eventId: string;
  thingToBuy?: ShoppingItemType;
  remainBudget: BudgetType;
  isInitialCreate?: boolean;
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

export default function ItemForm({
  eventId,
  thingToBuy,
  remainBudget,
  isInitialCreate,
}: ItemFormProps) {
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      item: thingToBuy ? thingToBuy.item : "",
      price: thingToBuy ? thingToBuy.price : 0,
      quantity: thingToBuy ? thingToBuy.quantity : 0,
    },
  });

  const [calculatedRemainBudget, setCalculatedRemainBudget] =
    useState(remainBudget);
  const price = useWatch({ control: form.control, name: "price" });
  const quantity = useWatch({ control: form.control, name: "quantity" });

  // Track and update the remaining budget
  useEffect(() => {
    const totalCost = price * quantity;
    setCalculatedRemainBudget(remainBudget - totalCost);
  }, [price, quantity, remainBudget]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      let response;
      const requestData = { ...data };

      if (thingToBuy) {
        response = await updateItem({
          eventId,
          itemId: thingToBuy.id,
          requestData,
        });
      } else if (isInitialCreate) {
        response = await createThingsToBuy({
          eventId,
          budget: remainBudget,
          requestData,
        });
      } else {
        response = await addItem({ requestData, eventId });
      }

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
                <>
                  <Input
                    {...field}
                    type="number"
                    placeholder="Enter price"
                    className="h-12 font-medium placeholder:text-textSub"
                  />
                  <p
                    className={`text-sm font-semibold ${calculatedRemainBudget < 0 ? "text-red-500" : ""}`}
                  >
                    {calculatedRemainBudget < 0 ? (
                      `You have exceeded your budget by $${Math.abs(calculatedRemainBudget)}`
                    ) : (
                      <>
                        You have
                        <span className="text-accentGreen">
                          {" "}
                          ${calculatedRemainBudget}{" "}
                        </span>
                        left in your budget.
                      </>
                    )}
                  </p>
                </>
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
