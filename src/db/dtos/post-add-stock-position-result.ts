export interface PostAddStockPositionResult {
  PositionId: number;
  StockSymbol: string;
  Quantity: number;
  BuyDate: Date;
  BuyPrice: number;
  CurrentPrice: number;
}
