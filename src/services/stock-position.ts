import { Service, Inject } from 'typedi';

import { StockRepository, StockHistoryRepository, StockPositionRepository } from '../db/repositories';
import WorldTradingDataService from './world-trading-data';

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
}

export default StockPositionService;