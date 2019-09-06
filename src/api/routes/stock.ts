import { Router, Request, Response } from 'express';
import { Container } from 'typedi';

import StockHistoryService from '../../services/stock-history';

const router = Router();

export default (app: Router) => {
  app.use('/stock', router);

  // TODO: Move this to a job
  router.get('/refresh-all', (req: Request, res: Response) => {
    const stockHistoryService: StockHistoryService = Container.get(StockHistoryService);
    stockHistoryService.refreshAll()
      .then(result => {
        res.status(200).send({
          message: "Success!"
        });
      })
      .catch(error => {
        res.status(400).send({
          message: `Something went wrong: ${error}`
        });
      });
  });
}