import { Router } from 'express';

const router = Router();

export default (app) => {
  app.use('/stock', router);

  router.get('/single-day-history', (req, res) => {
    res.send('Stock Single Day History');
  });
}