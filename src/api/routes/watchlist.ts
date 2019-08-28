import { Router, Request, Response } from 'express';

import WorldTradingDataService from '../../services/world-trading-data';

const router = Router();

export default (app) => {
  app.use('/watchlist', router);

  router.get('/', (req, res) => {
    res.send('Watchlists');
  });

  // TODO: Add async middleware to make this more readable
  router.post('/', (req: Request, res: Response) => {
    // TODO: Check if history for it already exists
    const worldTradingData = new WorldTradingDataService();

    worldTradingData.getFullHistoryBySymbol(req.body.StockSymbol)
      .then(history => {
        // TODO: Add StockHistory to DB
        // TODO: Add WatchlistStock to DB
        const watchlistStockId = 1;
        const historyDates = Object.keys(history);
        const mostRecentDate = historyDates[0];
        const mostRecentDateData = history[mostRecentDate];

        res.status(201).send({
          WatchlistStockId: watchlistStockId,
          CurrentPrice: mostRecentDateData.close
        });
      })
      .catch(error => {
        res.status(400).send({
          message: "Unable to find data for given stock. Please confirm that the symbol you provided is correct."
        });
      });
  });
};