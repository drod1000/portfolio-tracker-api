import { Service, Inject } from 'typedi';

@Service()
class StockHistoryRepository {
  constructor(
    @Inject('knex.connection') private _knex
  ) { }

}

export default StockHistoryRepository;