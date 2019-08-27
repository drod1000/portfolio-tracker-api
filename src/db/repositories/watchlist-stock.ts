import { Service, Inject } from 'typedi';

@Service()
class WatchlistStockRepository {
  constructor(
    @Inject('knex.connection') private _knex
  ) { }

}

export default WatchlistStockRepository;