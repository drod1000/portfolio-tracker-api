import { Router, Request, Response } from 'express';
import { Container } from 'typedi';

import StockPositionService from '../../services/stock-position';

const router = Router();

export default (app: Router) => {
  app.use('/positions', router);

  router.get('/', (req: Request, res: Response) => {
    const stockPositionService: StockPositionService = Container.get(StockPositionService);
    stockPositionService.getAllStockPositions()
      .then(positions => res.status(200).send(positions))
      .catch(error => {
        res.status(400).send({
          message: `Something went wrong: ${error}`
        });
      });
  });

  // TODO: Add async middleware to make this more readable
  router.post('/', (req: Request, res: Response) => {
    const stockPositionService: StockPositionService = Container.get(StockPositionService);
    stockPositionService.addStockPosition(req.body)
      .then(addResult => res.status(201).send(addResult))
      .catch(error => {
        res.status(400).send({
          message: `Something went wrong: ${error}`
        });
      });
  });

  router.post('/close', (req: Request, res: Response) => {
    const stockPositionService: StockPositionService = Container.get(StockPositionService);
    stockPositionService.closePosition(req.body)
      .then(closeResult => res.status(200).send(closeResult))
      .catch(error => {
        res.status(400).send({
          message: `Something went wrong: ${error}`
        });
      });
  });
};