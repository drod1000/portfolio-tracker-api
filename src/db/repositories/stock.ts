import { Service, Inject } from 'typedi';

@Service()
class StockRepository {
  constructor(
    @Inject('knex.connection') private _knex
  ) { }

  async insertStock(stockSymbol: string) {
    const result = this._knex('Stock').insert({ StockSymbol: stockSymbol});
    return result;
  }

  async getAllStocks() {
    const result = this._knex.select().from('Stock');
    return result;
  }

  async getStockBySymbol(stockSymbol: string){
    const result = this._knex.where('StockSymbol', stockSymbol).first();
    return result;
  }
}

export default StockRepository;