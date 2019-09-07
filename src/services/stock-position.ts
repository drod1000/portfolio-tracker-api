import { Service, Inject } from 'typedi';

import { StockRepository, StockHistoryRepository, StockPositionRepository, StockSaleRepository } from '../db/repositories';
import WorldTradingDataService from './world-trading-data';
import {
  PostAddStockPositionResult,
  PostAddStockPosition,
  StockHistoryInsert,
  StockPositionInsert,
  PostClosePosition,
  PostClosePositionResult,
  StockSaleInsert
} from '../db/dtos';

@Service()
class StockPositionService {
  @Inject()
  private _stockRepository: StockRepository;
  @Inject()
  private _stockHistoryRepository: StockHistoryRepository;
  @Inject()
  private _stockPositionRepository: StockPositionRepository;
  @Inject()
  private _stockSaleRepository: StockSaleRepository;
  @Inject()
  private _worldTradingDataService: WorldTradingDataService;

  async getAllStockPositions() {
    const rawResult = await this._stockPositionRepository.getAllStockPositions();
    // Raw returns additional data
    const [result] = rawResult;
    return result.filter(p => p.Quantity > 0);
  }

  async addStockPosition(inputDto: PostAddStockPosition): Promise<PostAddStockPositionResult> {
    let stockId: number;
    let currentPrice: number;
    const stock = await this._stockRepository.getStockBySymbol(inputDto.StockSymbol);

    if (stock) {
      stockId = stock.StockId;
      currentPrice = await this._stockHistoryRepository.getMostRecentPriceByStockId(stock.StockId);
    } else {
      const stockAndHistoryInsertResult = await this._insertStockAndFullHistory(inputDto.StockSymbol);
      stockId = stockAndHistoryInsertResult.StockId;
      currentPrice = stockAndHistoryInsertResult.CurrentPrice;
    }

    const stockPositionInsert: StockPositionInsert = {
      StockId: stockId,
      Quantity: inputDto.Quantity,
      BuyDate: inputDto.BuyDate.toString(),
      BuyPrice: inputDto.BuyPrice
    };
    const stockPositionInsertResult = await this._stockPositionRepository.insertStockPosition(stockPositionInsert);

    const result: PostAddStockPositionResult = {
      PositionId: stockPositionInsertResult[0],
      StockSymbol: inputDto.StockSymbol,
      Quantity: inputDto.Quantity,
      BuyDate: inputDto.BuyDate,
      BuyPrice: inputDto.BuyPrice,
      CurrentPrice: currentPrice
    };

    return new Promise(resolve => resolve(result));
  }

  async closePosition(inputDto: PostClosePosition): Promise<PostClosePositionResult> {
    const stockPosition = await this._stockPositionRepository.getStockPositionByPositionId(inputDto.PositionId);

    const newQuantity = stockPosition.Quantity - inputDto.Quantity;

    if (newQuantity < 0) {
      const rejection = Promise.reject("Sale quantity cannot be greater than position quantity.");
      return rejection;
    }

    const stockSaleInsert: StockSaleInsert = {
      StockId: stockPosition.StockId,
      PositionId: stockPosition.PositionId,
      Quantity: inputDto.Quantity,
      SellDate: inputDto.SellDate.toString(),
      SellPrice: inputDto.SellPrice
    };
    await this._stockSaleRepository.insertStockSale(stockSaleInsert);

    const result: PostClosePositionResult = {
      PositionId: stockPosition.PositionId,
      Quantity: newQuantity
    };

    return new Promise(resolve => resolve(result));
  }

  private async _insertStockAndFullHistory(stockSymbol: string): Promise<any> {
    const stockHistory = await this._worldTradingDataService.getFullHistoryBySymbol(stockSymbol);
    const stockInsertResult = await this._stockRepository.insertStock(stockSymbol);

    const stockHistoryInsert: StockHistoryInsert[] = Object.keys(stockHistory).map(date => {
      return {
        StockId: stockInsertResult[0],
        RecordDate: date,
        OpenPrice: stockHistory[date].open,
        ClosePrice: stockHistory[date].close
      };
    });
    await this._stockHistoryRepository.insertStockHistory(stockHistoryInsert);

    const result = {
      StockId: stockInsertResult[0],
      CurrentPrice: stockHistoryInsert[stockHistoryInsert.length - 1 ].ClosePrice
    }
    return new Promise(resolve => resolve(result));
  }

}

export default StockPositionService;