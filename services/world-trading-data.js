import axios from 'axios';
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
    const symbolPairs = [];
    let currentPair = [];

    for (let i = 0; i < symbols.length; i++) {
      const currentSymbol = symbols[i];
      currentPair.push(currentSymbol);
      if (i % 2 === 1 || i === symbols.length - 1) {
        symbolPairs.push(currentPair);
        currentPair = [];
      }
    }

    const responses = symbolPairs.map(p => this._getPairSingleDayHistory(p, date));
    const all = await Promise.all(responses);
    const finalResponse = all.reduce(((r, c) => Object.assign(r, c)), {});

    return new Promise(resolve => {
      resolve(finalResponse);
    });
  }

  async _getPairSingleDayHistory(symbols, date) {
    const symbolParams = symbols.join(',');
    const response = await axios.get(`${this.urlPrefix}/history_multi_single_day?symbol=${symbolParams}&date=${date}&api_token=${this.apiToken}`);

    return response.data.data;
  }

}

export default WorldTradingData;