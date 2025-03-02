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
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";

type BudgetFormProps = {
  eventId: string;
  budget?: number;
};

const budgetSchema = z.object({
  budget: z
    .string()
    .min(1, { message: "Please enter a budget" })
    .refine((val) => !isNaN(Number(val)), {
      message: "Budget must be a number",
    })
    .refine((val) => Number(val) > 0, {
      message: "Budget cannot be negative",
    })
    .refine((val) => Number.isInteger(Number(val)), {
      message: "Budget must be a whole number",
    }),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

export default function BudgetForm({ eventId, budget }: BudgetFormProps) {
  const router = useRouter();
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      budget: "",
    },
  });

  const onSubmit = (data: BudgetFormValues) => {
    const budget = Number(data.budget);
    if (budget) {
      router.push(`/event/${eventId}/to-buy/create?budget=${budget}`);
    } else {
      // TODO: call api to update budget
    }
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-semibold">Budget</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter your budget"
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
          {budget ? "Update budget" : "Next"}
        </Button>
      </form>
    </FormProvider>
  );
}
