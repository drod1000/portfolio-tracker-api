import { Service, Inject } from 'typedi';

import { StockRepository, StockHistoryRepository, StockPositionRepository } from '../db/repositories';
import WorldTradingDataService from './world-trading-data';
import {
  PostAddStockPositionResult,
  PostAddStockPosition,
  StockHistoryInsert,
  StockPositionInsert,
  PostClosePosition,
  StockPositionCloseUpdate,
  PostClosePositionResult
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
  private _worldTradingDataService: WorldTradingDataService;

  async getAllStockPositions() {
    const rawResult = await this._stockPositionRepository.getAllStockPositions();
    // Raw returns additional data
    const [result] = rawResult;
    return result;
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

    const stockPositionUpdateDto: StockPositionCloseUpdate = {
      PositionId: stockPosition.PositionId,
      Quantity: stockPosition.Quantity - inputDto.Quantity,
      SellDate: inputDto.SellDate.toString(),
      SellPrice: inputDto.SellPrice
    };
    await this._stockPositionRepository.closeStockPositionUpdate(stockPositionUpdateDto);

    const result: PostClosePositionResult = {
      PositionId: stockPosition.PositionId,
      Quantity: stockPositionUpdateDto.Quantity
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