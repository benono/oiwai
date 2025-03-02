import { Budget } from "@/types/to-buy";
import { create } from "zustand";

interface ToBuyStore {
  budgetAmount: Budget | 0;
  remainingBudget: Budget | 0;
  totalSpendAmount: number | 0;
  setBudgetAmount: (amount: Budget | 0) => void;
  setRemainingBudget: (amount: Budget | 0) => void;
  setTotalSpendAmount: (amount: number | 0) => void;
}

export const useToBuyStore = create<ToBuyStore>((set) => ({
  budgetAmount: 0,
  remainingBudget: 0,
  totalSpendAmount: 0,
  setBudgetAmount: (amount) => set({ budgetAmount: amount }),
  setRemainingBudget: (amount) => set({ remainingBudget: amount }),
  setTotalSpendAmount: (amount) => set({ totalSpendAmount: amount }),
}));
