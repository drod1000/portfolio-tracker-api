import { Router } from 'express';

const router = Router();

export default (app) => {
  app.use('/positions', router);

  router.get('/', (req, res) => {
    res.send('Positions');
  });

  router.post('/', (req, res) => {
    res.send('You added a stock to your positions');
  });
};