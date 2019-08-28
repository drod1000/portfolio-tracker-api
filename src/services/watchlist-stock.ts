import { Service, Inject } from 'typedi';

import { StockRepository, StockHistoryRepository, WatchlistStockRepository } from '../db/repositories';
import WorldTradingDataService from './world-trading-data';
import { PostAddWatchlistStockResult } from '../db/dtos/post-add-watchlist-stock-result';
import { WatchlistStockInsert } from '../db/dtos/watchlist-stock-insert';
import { PostAddWatchlistStock } from '../db/dtos/post-add-watchlist-stock';
import { StockHistoryInsert } from '../db/dtos/stock-history-insert';

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

  async addStockPosition(inputDto: PostAddWatchlistStock) {
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
      WatchDate: new Date().toString(),
      WatchPrice: currentPrice
    };
    const watchlistStockInsertResult = await this._watchlistStockRepository.insertWatchlistStock(watchlistStockInsert);

    const result: PostAddWatchlistStockResult = {
      WatchlistStockId: watchlistStockInsertResult[0],
      StockSymbol: inputDto.StockSymbol,
      WatchDate: new Date(watchlistStockInsert.WatchDate),
      WatchPrice: currentPrice,
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