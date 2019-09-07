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

  async getAllStockPositions() {
    const result = this._knex.raw(
      ` SELECT
          sp.PositionId, IF(qs.QuantitySold IS NULL, sp.Quantity, sp.Quantity-qs.QuantitySold) AS Quantity, sp.BuyDate, sp.BuyPrice, s.StockSymbol, sh.RecordDate, sh.ClosePrice AS CurrentPrice
        FROM StockPosition sp
        INNER JOIN Stock s ON sp.StockId=s.StockId
        INNER JOIN (
          SELECT
            oh.StockId, oh.RecordDate, oh.ClosePrice
          FROM StockHistory oh
          LEFT JOIN StockHistory nh ON oh.StockId=nh.StockId AND oh.RecordDate < nh.RecordDate
          WHERE nh.RecordDate IS NULL
        ) sh ON sp.StockId=sh.StockId
        LEFT JOIN (
          SELECT
            PositionId, SUM(Quantity) AS QuantitySold
          FROM StockSale
          GROUP BY PositionId
        ) qs ON sp.PositionId=qs.PositionId
      `
    );

    return result;
  }

  async getStockPositionByPositionId(positionId: number) {
    const result = this._knex('StockPosition')
      .where('PositionId', positionId)
      .first();

    return result;
  }

}

export default StockPositionRepository;