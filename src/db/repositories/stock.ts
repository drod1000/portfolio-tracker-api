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

  async getAllStocksWithMostRecentHistory() {
    const result = this._knex.raw(
      ` SELECT
          s.StockId, s.StockSymbol, sh.RecordDate
        FROM Stock s
        INNER JOIN (
          SELECT
            oh.StockId, oh.RecordDate
          FROM StockHistory oh
          LEFT JOIN StockHistory nh ON oh.StockId=nh.StockId AND oh.RecordDate < nh.RecordDate
          WHERE nh.RecordDate IS NULL
      ) sh ON s.StockId=sh.StockId`
    );

    return result;
  }

  async getStockBySymbol(stockSymbol: string){
    const result = this._knex('Stock').where('StockSymbol', stockSymbol).first();
    return result;
  }
}

export default StockRepository;