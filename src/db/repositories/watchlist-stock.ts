import { Service, Inject } from 'typedi';

import WatchlistStockInsert from '../dtos/watchlist-stock-insert';

@Service()
class WatchlistStockRepository {
  constructor(
    @Inject('knex.connection') private _knex
  ) { }

  async insertWatchlistStock(dto: WatchlistStockInsert) {
    const result = this._knex('WatchlistStock').insert(dto);
    return result;
  }

  async getWatchlist() {
    const result = this._knex.raw(
      ` SELECT
          ws.WatchlistStockId, ws.WatchDate, ws.WatchPrice, s.StockSymbol, sh.RecordDate, sh.ClosePrice as CurrentPrice FROM WatchlistStock ws
        INNER JOIN Stock s ON ws.StockId=s.StockId
        INNER JOIN (
          SELECT oh.StockId, oh.RecordDate, oh.ClosePrice FROM StockHistory oh
          LEFT JOIN StockHistory nh ON oh.StockId=nh.StockId AND oh.RecordDate < nh.RecordDate
          WHERE nh.RecordDate IS NULL
        ) sh ON ws.StockId=sh.StockId;
      `
    );

    return result;
  }
}

export default WatchlistStockRepository;