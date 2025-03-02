export type BaseItemType = {
  item: string;
  price: number;
  quantity: number;
};

export type ShoppingItem = BaseItemType & {
  id: string;
  isPurchase: boolean;
};

export type Budget = number;
