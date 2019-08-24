import { Container } from 'typedi';
import StockRepository from '../db/repositories/stock';

export default ({ knexConnection }) => {
  Container.set("knex.connection", knexConnection);
  Container.set("stock.repository", new StockRepository(Container));
}