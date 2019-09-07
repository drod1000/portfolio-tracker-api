import express from 'express';
import "reflect-metadata";
import { Container } from 'typedi/Container';
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

  process.exit();
}

const isRefresh = process.argv.find(arg => arg === "refresh");

if(isRefresh) {
  refreshOnly();
} else {
  startServer();
}
