import express from 'express';
import "reflect-metadata";

async function startServer() {
  const app = express();
  await require('./initializers').default({ expressApp: app });

  app.listen(3000, () => {
    console.log('Listening on port 3000');
  });
}

startServer();