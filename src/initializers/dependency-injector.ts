import { Container } from 'typedi';
import { StockRepository, StockHistoryRepository, StockPositionRepository, WatchlistStockRepository } from '../db/repositories';

export default ({ knexConnection }) => {
  Container.set("knex.connection", knexConnection);
}