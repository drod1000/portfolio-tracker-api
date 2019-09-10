import express from 'express';
import "reflect-metadata";
import { Container } from 'typedi/Container';

import automationInitializer from './initializers/automation-initializer';
import DailyUpdateService from './services/daily-update';

async function startServer() {
  const app = express();
  await require('./initializers').default({ expressApp: app });

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
}

async function dailyUpdate() {
  await require('./initializers/automation-initializer').default();

  const dailyUpdateService = Container.get(DailyUpdateService);

  console.log("Sending update");
  await dailyUpdateService.sendDailyUpdate();

  console.log('Exiting');
  process.exit();
}

const isDailyUpdate = process.argv.find(arg => arg === "daily-update");

if(isDailyUpdate) {
  dailyUpdate();
} else {
  startServer();
}
