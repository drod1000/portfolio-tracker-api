import { Router } from 'express';

const router = Router();

export default (app) => {
  app.use('/watchlist', router);

  router.get('/', (req, res) => {
    res.send('Watchlists');
  });

  router.post('/', (req, res) => {
    res.send('You added a stock to your watchlist');
  });
};