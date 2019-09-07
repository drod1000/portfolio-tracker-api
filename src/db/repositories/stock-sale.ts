import { Service, Inject } from 'typedi';
import { StockSaleInsert } from '../dtos';

@Service()
class StockSaleRepository {
  constructor(
    @Inject('knex.connection') private _knex
  ) { }

  async insertStockSale(dto: StockSaleInsert) {
    const result = this._knex('StockSale').insert(dto);
    return result;
  }
}

export default StockSaleRepository;