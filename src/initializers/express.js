import bodyParser from 'body-parser';

import routes from '../api';

export default ({ app }) => {
  app.use(bodyParser.json());
  app.use('/', routes());
};