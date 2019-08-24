import { Container } from 'typedi';
import { StockRepository, StockHistoryRepository, StockPositionRepository, WatchlistStockRepository } from '../db/repositories';

export default ({ knexConnection }) => {
  Container.set("knex.connection", knexConnection);
  Container.set("stock.repository", new StockRepository(Container));
  Container.set("stock-history.repository", new StockHistoryRepository(Container));
  Container.set("stock-position.repository", new StockPositionRepository(Container));
  Container.set("watchlist-stock.repository", new WatchlistStockRepository(Container));
}