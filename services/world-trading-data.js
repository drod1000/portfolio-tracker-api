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
}

export default WorldTradingData;