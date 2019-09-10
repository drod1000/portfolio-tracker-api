import moment from 'moment';
import { Service, Inject } from 'typedi';

import { StockRepository, StockHistoryRepository } from '../db/repositories';
import WorldTradingDataService from './world-trading-data';
import { StockHistoryRefresh, StockHistoryInsert } from '../db/dtos';

@Service()
class StockHistoryService {
  @Inject()
  private _stockRepository: StockRepository;
  @Inject()
  private _stockHistoryRepository: StockHistoryRepository;
  @Inject()
  private _worldTradingDataService: WorldTradingDataService;

  async refreshAll() {
    const rawResult = await this._stockRepository.getAllStocksWithMostRecentHistory();
    const stocks: StockHistoryRefresh[] = rawResult[0];
    await Promise.all(stocks.map(s => this._fetchAndRefreshStockHistory(s)));

    return new Promise(resolve => resolve(true));
  }

  private async _fetchAndRefreshStockHistory(stock: StockHistoryRefresh) {
    const startDate = moment(stock.RecordDate).add(1, 'days');
    const stockHistory = await this._worldTradingDataService.getFullHistoryBySymbolAndStartDate(stock.StockSymbol, startDate.toDate());

    if (!stockHistory) {
      return new Promise(resolve => resolve(true));
    }

    const stockHistoryInsert: StockHistoryInsert[] = Object.keys(stockHistory).map(date => {
      return {
        StockId: stock.StockId,
        RecordDate: date,
        OpenPrice: stockHistory[date].open,
        ClosePrice: stockHistory[date].close
      };
    });
    await this._stockHistoryRepository.insertStockHistory(stockHistoryInsert);

    return new Promise(resolve => resolve(true));
  }
}

export default StockHistoryService;