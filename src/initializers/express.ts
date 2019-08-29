import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import routes from '../api';

export default ({ app }: { app: express.Application }) => {
  app.use(cors());
  app.use(bodyParser.json());
  app.use('/', routes());
};