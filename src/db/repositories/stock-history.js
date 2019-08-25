import { Service } from "typedi";

@Service()
class StockHistoryRepository {
  constructor(container) {
    this._knexConnection = container.get('knex.connection');
  }

}

export default StockHistoryRepository;