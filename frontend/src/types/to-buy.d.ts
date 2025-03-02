export type BaseItemType = {
  item: string;
  price: number;
  quantity: number;
};

export type ShoppingItemType = BaseItemType & {
  id: number;
  isPurchase: boolean;
};

export type BudgetDetailType = BudgetType & {
  remainBudget: number;
  totalspend: number;
};

export type BudgetType = number;
