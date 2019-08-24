import { Router } from 'express';

import WorldTradingData from '../../services/world-trading-data';

const router = Router();

export default (app) => {
  app.use('/stock', router);

  // TODO: Move this to a job
  router.get('/single-day-history', (req, res) => {
    // TODO: Get from Stock DB;
    const symbols = ["AAPL", "WFC"];
    const worldTradingData = new WorldTradingData();

    worldTradingData.getMultipleSingleDayHistory(symbols, req.query.date)
      .then(data => {
        const responseContent = Object.keys(data)
          .map(symbol => {
            return {
              StockSymbol: symbol,
              Price: data[symbol].close
            };
          });

        res.status(200).send({
          data: responseContent
        });
      })
      .catch(error => {
        res.status(400).send({
          message: "Unable to retrieve data for date provided. Please confirm the market was open on that day."
        })
      })
  });
}