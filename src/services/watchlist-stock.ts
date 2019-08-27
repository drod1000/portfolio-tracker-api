import { Service, Inject } from 'typedi';

import { StockRepository, StockHistoryRepository, WatchlistStockRepository } from '../db/repositories';
import WorldTradingDataService from './world-trading-data';

@Service()
class WatchlistStockService {
  @Inject()
  private _stockRepository: StockRepository;
  @Inject()
  private _stockHistoryRepository: StockHistoryRepository;
  @Inject()
  private _watchlistStockRepository: WatchlistStockRepository
  @Inject()
  private _worldTradingDataService: WorldTradingDataService
}

export default WatchlistStockService;