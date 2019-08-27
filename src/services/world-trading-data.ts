import axios from 'axios';
import chunk from 'lodash/chunk';
import reduce from 'lodash/reduce';
import { Service } from 'typedi';
require('dotenv').config();

@Service()
class WorldTradingDataService {
  private _urlPrefix: string;
  private _apiToken: string;
  private _startDate: string;
  constructor() {
    this._urlPrefix = 'https://api.worldtradingdata.com/api/v1';
    this._apiToken = process.env.WORLD_TRADING_DATA_API_KEY;
    this._startDate = '2014-01-01';
  }

  async getFullHistoryBySymbol(stockSymbol: string) {
    const response = await axios.get(`${this._urlPrefix}/history?symbol=${stockSymbol}&date_from=${this._startDate}&api_token=${this._apiToken}`);
    return response.data.history;
  }

  async getMultipleSingleDayHistory(symbols: string[], date) {
    const symbolPairs = chunk(symbols, 2);
    const responsePromises = symbolPairs.map(p => this._getPairSingleDayHistory(p, date));
    const responses = await Promise.all(responsePromises);
    const flattenedResponse = reduce(responses, (result, current) => Object.assign(result, current), {});
    const result = new Promise(resolve => resolve(flattenedResponse));

    return result;
  }

  private async _getPairSingleDayHistory(symbols: string[], date) {
    const symbolParams = symbols.join(',');
    const response = await axios.get(`${this._urlPrefix}/history_multi_single_day?symbol=${symbolParams}&date=${date}&api_token=${this._apiToken}`);

    return response.data.data;
  }

}

export default WorldTradingDataService;