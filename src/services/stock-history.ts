import { Service, Inject } from 'typedi';

import { StockRepository, StockHistoryRepository } from '../db/repositories';
import WorldTradingDataService from './world-trading-data';

@Service()
class StockHistoryService {
  @Inject()
  private _stockRepository: StockRepository;
  @Inject()
  private _worldTradingDataService: WorldTradingDataService;

  async refreshAll() {
    // Get all Stocks with most recent StockHistory records
    // For each Stock
      // Fetch from one day after most recent from WTD
      // Insert new StockHistory records
  }
}

export default StockHistoryService;