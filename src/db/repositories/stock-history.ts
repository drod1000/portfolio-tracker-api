import { Service, Inject } from 'typedi';

import StockHistoryInsert from '../dtos/stock-history-insert';

@Service()
class StockHistoryRepository {
  constructor(
    @Inject('knex.connection') private _knex
  ) { }

  async insertStockHistory(history: StockHistoryInsert[]) {
    const result = this._knex('StockHistory').insert(history);
    return result;
  }

  async getMostRecentPriceByStockId(stockId: number) {
    const result = this._knex('StockHistory')
      .where('StockId', stockId)
      .orderBy('RecordDate', 'desc')
      .first();

    return result;
  }
}

export default StockHistoryRepository;