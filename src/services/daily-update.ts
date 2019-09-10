import { Service, Inject } from 'typedi';
import moment from 'moment';

import StockHistoryService from './stock-history';
import StockPositionService from './stock-position';
import WatchlistStockService from './watchlist-stock';
import SendgridService from './sendgrid';

@Service()
class DailyUpdateService {
  @Inject()
  private _stockHistoryService: StockHistoryService;
  @Inject()
  private _stockPositionService: StockPositionService;
  @Inject()
  private _watchlistStockService: WatchlistStockService;
  @Inject()
  private _sendgridService: SendgridService;

  async sendDailyUpdate() {
    await this._stockHistoryService.refreshAll();

    const emailDate = moment().format('MMM D YYYY');
    const positions = await this._stockPositionService.getAllStockPositions();
    const watchlist = await this._watchlistStockService.getWatchlist();
    const templateData = {
      "EmailDate": emailDate,
      "Positions": positions,
      "Watchlist": watchlist
    };

    const result = await this._sendgridService.sendTemplateMessage('d-4bc9d2c2900f47f2a87a4004829bece4', templateData);

    return result;
  }
}

export default DailyUpdateService;