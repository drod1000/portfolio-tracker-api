import express from 'express';
import bodyParser from 'body-parser';

import routes from '../api';

export default ({ app }: { app: express.Application }) => {
  app.use(bodyParser.json());
  app.use('/', routes());
};