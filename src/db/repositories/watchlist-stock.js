import { Service } from "typedi";

@Service()
class WatchlistStockRepository {
  constructor(container) {
    this._knexConnection = container.get('knex.connection');
  }

}

export default WatchlistStockRepository;