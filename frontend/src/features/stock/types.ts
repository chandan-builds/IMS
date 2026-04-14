export interface Stock {
  _id: string;
  orgId: string;
  productId: any; // Can be string or populated object
  variantId: any;
  shopId: any;
  baseQuantity: number;
  displayUnit: string;
  lastUpdated: string;
}

export interface StockTransaction {
  _id: string;
  orgId: string;
  productId: any;
  variantId: any;
  shopId: any;
  type: "purchase" | "sale" | "adjustment" | "damage" | "return" | "transfer_in" | "transfer_out";
  quantity: number;
  unit: string;
  baseQuantity: number;
  balanceAfter: number;
  referenceType: string;
  referenceId: string;
  note?: string;
  createdBy: any;
  createdAt: string;
}

export interface StockAdjustmentPayload {
  shopId: string;
  productId: string;
  variantId?: string | null;
  type: string;
  quantity: number;
  unitSymbol: string;
  note?: string;
}

export interface StockTransferPayload {
  fromShopId: string;
  toShopId: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  unitSymbol: string;
  note?: string;
}
