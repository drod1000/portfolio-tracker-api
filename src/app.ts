import express from 'express';
import "reflect-metadata";
import { Container } from 'typedi/Container';
import sgMail from '@sendgrid/mail';
require('dotenv').config();

import StockHistoryService from './services/stock-history';

async function startServer() {
  const app = express();
  await require('./initializers').default({ expressApp: app });

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
}

async function refreshOnly() {
  const app = express();
  await require('./initializers').default({ expressApp: app });

  console.log("Refresh starting");

  const stockHistoryService = Container.get(StockHistoryService);
  await stockHistoryService.refreshAll();

  console.log("Refresh complete");

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: process.env.USER_EMAIL,
    from: process.env.USER_EMAIL,
    subject: 'Daily Update',
    template_id: 'd-4bc9d2c2900f47f2a87a4004829bece4',
    "dynamic_template_data": {
      "EmailDate": "2018-09-01",
      "Positions": [
        {
          "PositionId":9,
          "Quantity":14,
          "BuyDate":"2018-10-02T05:00:00.000Z",
          "BuyPrice":161.53,
          "StockSymbol":"FB",
          "RecordDate":"2019-09-06T05:00:00.000Z",
          "CurrentPrice":187.49
        },
        {
          "PositionId":10,
          "Quantity":22,
          "BuyDate":"2018-11-21T06:00:00.000Z",
          "BuyPrice":70.01,
          "StockSymbol":"TGT",
          "RecordDate":"2019-09-06T05:00:00.000Z",
          "CurrentPrice":109.85
        }
      ],
      "Watchlist": [
        {
          "WatchlistStockId":1,
          "WatchDate":"2019-08-28T05:00:00.000Z",
          "WatchPrice":135.19,
          "StockSymbol":"PEP",
          "RecordDate":"2019-09-06T05:00:00.000Z",
          "CurrentPrice":137.37
        },
        {
          "WatchlistStockId":2,
          "WatchDate":"2019-08-28T05:00:00.000Z",
          "WatchPrice":136.4,
          "StockSymbol":"DIS",
          "RecordDate":"2019-09-06T05:00:00.000Z",
          "CurrentPrice":139.55
        }
      ]
    }
  };
  console.log('About to send');
  await sgMail.send(msg);
  console.log('Exiting');

  process.exit();
}

const isRefresh = process.argv.find(arg => arg === "refresh");

if(isRefresh) {
  refreshOnly();
} else {
  startServer();
}
