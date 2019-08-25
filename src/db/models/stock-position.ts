export interface StockPosition {
  PositionId: number;
  StockId: number;
  Quantity: number;
  BuyDate: Date;
  BuyPrice: number;
  SellDate?: Date;
  SellPrice?: number;
}