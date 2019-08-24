class StockPositionRepository {
  constructor(container) {
    this._knexConnection = container.get('knex.connection');
  }

}

export default StockPositionRepository;