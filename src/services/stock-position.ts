import { Service, Inject } from 'typedi';

import { StockRepository, StockHistoryRepository, StockPositionRepository } from '../db/repositories';
import WorldTradingDataService from './world-trading-data';
import { PostAddStockPositionResult } from '../db/dtos/post-add-stock-position-result';
import { PostAddStockPosition } from '../db/dtos/post-add-stock-position';
import { StockHistoryInsert } from '../db/dtos/stock-history-insert';
import { StockPositionInsert } from '../db/dtos/stock-position-insert';

@Service()
class StockPositionService {
  @Inject()
  private _stockRepository: StockRepository;
  @Inject()
  private _stockHistoryRepository: StockHistoryRepository;
  @Inject()
  private _stockPositionRepository: StockPositionRepository
  @Inject()
  private _worldTradingDataService: WorldTradingDataService

  async addStockPosition(inputDto: PostAddStockPosition) {
    let stockId: number;
    let currentPrice: number;
    const stock = await this._stockRepository.getStockBySymbol(inputDto.StockSymbol);
    if (stock) {
      stockId = stock.StockId;
      currentPrice = await this._stockHistoryRepository.getMostRecentPriceByStockId(stock.StockId);

    } else {
      const stockHistory = await this._worldTradingDataService.getFullHistoryBySymbol(inputDto.StockSymbol);
      const stockInsertResult = await this._stockRepository.insertStock(inputDto.StockSymbol);
      stockId = stockInsertResult[0];
      const stockHistoryDates = Object.keys(stockHistory);
      const stockHistoryInsert: StockHistoryInsert[] = stockHistoryDates.map(date => {
        return {
          StockId: stockId,
          RecordDate: date,
          OpenPrice: stockHistory[date].open,
          ClosePrice: stockHistory[date].close
        };
      });

      const stockHistoryInsertResult = await this._stockHistoryRepository.insertStockHistory(stockHistoryInsert);
      currentPrice = stockHistoryInsert[stockHistoryInsert.length - 1 ].ClosePrice;
    }
    const stockPositionInsert: StockPositionInsert = {
      StockId: stockId,
      Quantity: inputDto.Quantity,
      BuyDate: new Date().toDateString(),
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

    return new Promise(resolve => {
      resolve(result);
    });
  }
}

export default StockPositionService;