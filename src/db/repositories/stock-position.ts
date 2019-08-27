import { Service, Inject } from 'typedi';

@Service()
class StockPositionRepository {
  constructor(
    @Inject('knex.connection') private _knex
  ) { }

}

export default StockPositionRepository;