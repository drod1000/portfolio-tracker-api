import { Service, Inject } from 'typedi';

import { StockRepository, StockHistoryRepository, WatchlistStockRepository } from '../db/repositories';
import WorldTradingDataService from './world-trading-data';
import {
  PostAddWatchlistStockResult,
  WatchlistStockInsert,
  PostAddWatchlistStock,
  StockHistoryInsert
} from '../db/dtos';

@Service()
class WatchlistStockService {
  @Inject()
  private _stockRepository: StockRepository;
  @Inject()
  private _stockHistoryRepository: StockHistoryRepository;
  @Inject()
  private _watchlistStockRepository: WatchlistStockRepository;
  @Inject()
  private _worldTradingDataService: WorldTradingDataService;

  async getWatchlist() {
    const rawResult = await this._watchlistStockRepository.getWatchlist();
    // Raw returns additional data
    const [result] = rawResult;
    return result;
  }

  async addWatchlistStock(inputDto: PostAddWatchlistStock): Promise<PostAddWatchlistStockResult> {
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

    const watchlistStockInsert: WatchlistStockInsert = {
      StockId: stockId,
      WatchDate: inputDto.WatchDate.toString(),
      WatchPrice: inputDto.WatchPrice
    };
    const watchlistStockInsertResult = await this._watchlistStockRepository.insertWatchlistStock(watchlistStockInsert);

    const result: PostAddWatchlistStockResult = {
      WatchlistStockId: watchlistStockInsertResult[0],
      StockSymbol: inputDto.StockSymbol,
      WatchDate: inputDto.WatchDate,
      WatchPrice: inputDto.WatchPrice,
      CurrentPrice: currentPrice
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

export default WatchlistStockService;