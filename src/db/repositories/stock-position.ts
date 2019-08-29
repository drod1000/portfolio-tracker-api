import { Service, Inject } from 'typedi';

import StockPositionInsert from '../dtos/stock-position-insert';

@Service()
class StockPositionRepository {
  constructor(
    @Inject('knex.connection') private _knex
  ) { }

  async insertStockPosition(dto: StockPositionInsert) {
    const result = this._knex('StockPosition').insert(dto);
    return result;
  }

  // async getAllStockPositions() {
  //   const result = this._knex('StockPosition')
  //     .join('Stock', 'StockPosition.StockId', 'Stock.StockId')
  //     .select('*')

  //   return result;
  // }
  async getAllStockPositions() {
    const result = this._knex.raw(
      ` SELECT
          sp.PositionId, sp.Quantity, sp.BuyDate, sp.BuyPrice, s.StockSymbol, sh.RecordDate, sh.ClosePrice as CurrentPrice
        FROM StockPosition sp
        INNER JOIN Stock s ON sp.StockId=s.StockId
        INNER JOIN (
          SELECT
            oh.StockId, oh.RecordDate, oh.ClosePrice
          FROM StockHistory oh
          LEFT JOIN StockHistory nh ON oh.StockId=nh.StockId AND oh.RecordDate < nh.RecordDate
          WHERE nh.RecordDate IS NULL
        ) sh ON sp.StockId=sh.StockId
      `
    );

    return result;
  }
}

export default StockPositionRepository;