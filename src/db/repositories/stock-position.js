import { Service } from "typedi";

@Service()
class StockPositionRepository {
  constructor(container) {
    this._knexConnection = container.get('knex.connection');
  }

}

export default StockPositionRepository;