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
}

export default StockPositionRepository;