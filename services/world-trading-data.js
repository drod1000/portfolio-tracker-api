import axios from 'axios';
import chunk from 'lodash/chunk';
import reduce from 'lodash/reduce';
require('dotenv').config();

class WorldTradingData {
  constructor() {
    this.urlPrefix = 'https://api.worldtradingdata.com/api/v1';
    this.apiToken = process.env.WORLD_TRADING_DATA_API_KEY;
    this.startDate = '2014-01-01';
  }

  async getFullHistory(stockSymbol) {
    const response = await axios.get(`${this.urlPrefix}/history?symbol=${stockSymbol}&date_from=${this.startDate}&api_token=${this.apiToken}`);
    return response.data.history;
  }

  async getMultipleSingleDayHistory(symbols, date) {
    const symbolPairs = chunk(symbols, 2);
    const responsePromises = symbolPairs.map(p => this._getPairSingleDayHistory(p, date));
    const responses = await Promise.all(responsePromises);
    const flattenedResponse = reduce(responses, (result, current) => Object.assign(result, current), {});
    const result = new Promise(resolve => resolve(flattenedResponse));

    return result;
  }

  async _getPairSingleDayHistory(symbols, date) {
    const symbolParams = symbols.join(',');
    const response = await axios.get(`${this.urlPrefix}/history_multi_single_day?symbol=${symbolParams}&date=${date}&api_token=${this.apiToken}`);

    return response.data.data;
  }

}

export default WorldTradingData;