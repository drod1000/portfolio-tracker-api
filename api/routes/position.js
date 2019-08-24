import { Router } from 'express';

import WorldTradingData from '../../services/world-trading-data';

const router = Router();

export default (app) => {
  app.use('/positions', router);

  router.get('/', (req, res) => {
    res.send("Positions");
  });

  // TODO: Add async middleware to make this more readable
  router.post('/', (req, res) => {
    // TODO: Check if history for it already exists
    const worldTradingData = new WorldTradingData();

    worldTradingData.getFullHistory(req.body.StockSymbol)
      .then(history => {
        // TODO: Add StockHistory to DB
        // TODO: Add StockPosition to DB
        const stockPostionId = 1;
        const historyDates = Object.keys(history);
        const mostRecentDate = historyDates[0];
        const mostRecentDateData = history[mostRecentDate];

        res.status(201).send({
          StockPositionId: stockPostionId,
          CurrentPrice: mostRecentDateData.close
        });
      })
      .catch(error => {
        res.status(400).send({
          message: "Unable to find data for given stock. Please confirm that the symbol you provided is correct"
        });
      });
  });
};