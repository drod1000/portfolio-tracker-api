import { Service } from "typedi";

@Service()
class StockRepository {
  constructor(container) {
    this._knexConnection = container.get('knex.connection');
  }

  async getAllStocks() {
    const result = this._knexConnection.select().from('Stock');
    return result;
  }
}

export default StockRepository;