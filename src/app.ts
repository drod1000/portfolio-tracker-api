import express from 'express';
import "reflect-metadata";
import { Container } from 'typedi/Container';

import DailyUpdateService from './services/daily-update';

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

  const dailyUpdateService = Container.get(DailyUpdateService);
  console.log("Sending update");
  await dailyUpdateService.sendDailyUpdate();

  console.log('Exiting');
  process.exit();
}

const isRefresh = process.argv.find(arg => arg === "refresh");

if(isRefresh) {
  refreshOnly();
} else {
  startServer();
}
