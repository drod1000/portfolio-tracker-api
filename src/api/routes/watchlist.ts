import { Router, Request, Response } from 'express';

import { Container } from 'typedi';

import WatchlistStockService from '../../services/watchlist-stock';

const router = Router();

export default (app) => {
  app.use('/watchlist', router);

  router.get('/', (req, res) => {
    const watchlistStockService: WatchlistStockService = Container.get(WatchlistStockService);
    watchlistStockService.getWatchlist()
      .then(watchlist => res.status(200).send(watchlist))
      .catch(error => {
        res.status(400).send({
          message: `Something went wrong: ${error}`
        });
      });
  });

  // TODO: Add async middleware to make this more readable
  router.post('/', (req: Request, res: Response) => {
    const watchlistStockService: WatchlistStockService = Container.get(WatchlistStockService);
    watchlistStockService.addWatchlistStock(req.body)
      .then(addResult => res.status(201).send(addResult))
      .catch(error => {
        res.status(400).send({
          message: `Something went wrong: ${error}`
        });
      });
  });
};