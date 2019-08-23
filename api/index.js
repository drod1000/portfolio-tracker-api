import { Router } from 'express';

import position from './routes/position';
import watchlist from './routes/watchlist';

export default () => {
  const app = Router();
  position(app);
  watchlist(app);

  return app;
};
