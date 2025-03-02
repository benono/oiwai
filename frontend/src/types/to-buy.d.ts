export type Item = {
  item: string;
  price: number;
  quantity: number;
};

export type ShoppingItem = Item & {
  id: string;
  isPurchase: boolean;
};

export type Budget = number;
