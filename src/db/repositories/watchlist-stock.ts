import { Service, Inject } from 'typedi';

import { WatchlistStockInsert } from '../dtos/watchlist-stock-insert';

@Service()
class WatchlistStockRepository {
  constructor(
    @Inject('knex.connection') private _knex
  ) { }

  async insertWatchlistStock(dto: WatchlistStockInsert) {
    const result = this._knex('WatchlistStock').insert(dto);
    return result;
  }
}

export default WatchlistStockRepository;