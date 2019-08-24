import { Router } from 'express';

import position from './routes/position';
import watchlist from './routes/watchlist';
import stock from './routes/stock';

export default () => {
  const app = Router();
  position(app);
  watchlist(app);
  stock(app);

  return app;
};
