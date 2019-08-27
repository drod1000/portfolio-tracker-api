import { Service, Inject } from 'typedi';

@Service()
class StockRepository {
  constructor(
    @Inject('knex.connection') private _knex
  ) { }

  async getAllStocks() {
    const result = this._knex.select().from('Stock');
    return result;
  }
}

export default StockRepository;