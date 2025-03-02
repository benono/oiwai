export type BaseItemType = {
  item: string;
  price: number;
  quantity: number;
};

export type ShoppingItem = BaseItemType & {
  id: number;
  isPurchase: boolean;
};

export type BudgetType = Budget & {
  remainBudget: number;
  totalSpend: number;
};

export type Budget = number;
