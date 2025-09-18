import axios from 'axios';

class PolygonService {
  constructor() {
    this.baseURL = 'https://api.polygon.io';
    this.apiKey = import.meta.env.VITE_POLYGON_KEY;
  }

  /**
   * Get real-time stock quote
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Real-time quote data
   */
  async getQuote(symbol) {
    try {
      const response = await axios.get(
        `${this.baseURL}/v2/last/trade/${symbol}`,
        {
          params: { apikey: this.apiKey }
        }
      );

      return this.formatQuoteData(response.data, symbol);
    } catch (error) {
      console.error('Polygon quote error:', error);
      throw error;
    }
  }

  /**
   * Get aggregated bars (OHLC) data
   * @param {string} symbol - Stock symbol
   * @param {number} multiplier - Size of timespan multiplier
   * @param {string} timespan - Size of time window (minute, hour, day, week, month, quarter, year)
   * @param {string} from - From date (YYYY-MM-DD)
   * @param {string} to - To date (YYYY-MM-DD)
   * @returns {Promise<Object>} Aggregated bars data
   */
  async getAggregates(symbol, multiplier = 1, timespan = 'day', from, to) {
    try {
      const response = await axios.get(
        `${this.baseURL}/v2/aggs/ticker/${symbol}/range/${multiplier}/${timespan}/${from}/${to}`,
        {
          params: { 
            adjusted: true,
            sort: 'asc',
            limit: 5000,
            apikey: this.apiKey 
          }
        }
      );

      return this.formatAggregatesData(response.data, symbol);
    } catch (error) {
      console.error('Polygon aggregates error:', error);
      throw error;
    }
  }

  /**
   * Get daily open/close for a specific date
   * @param {string} symbol - Stock symbol
   * @param {string} date - Date (YYYY-MM-DD)
   * @returns {Promise<Object>} Daily open/close data
   */
  async getDailyOpenClose(symbol, date) {
    try {
      const response = await axios.get(
        `${this.baseURL}/v1/open-close/${symbol}/${date}`,
        {
          params: { 
            adjusted: true,
            apikey: this.apiKey 
          }
        }
      );

      return this.formatDailyData(response.data);
    } catch (error) {
      console.error('Polygon daily open/close error:', error);
      throw error;
    }
  }

  /**
   * Get market status
   * @returns {Promise<Object>} Current market status
   */
  async getMarketStatus() {
    try {
      const response = await axios.get(
        `${this.baseURL}/v1/marketstatus/now`,
        {
          params: { apikey: this.apiKey }
        }
      );

      return {
        market: response.data.market,
        serverTime: response.data.serverTime,
        exchanges: response.data.exchanges
      };
    } catch (error) {
      console.error('Polygon market status error:', error);
      throw error;
    }
  }

  /**
   * Get ticker details
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Ticker details
   */
  async getTickerDetails(symbol) {
    try {
      const response = await axios.get(
        `${this.baseURL}/v3/reference/tickers/${symbol}`,
        {
          params: { apikey: this.apiKey }
        }
      );

      return this.formatTickerDetails(response.data.results);
    } catch (error) {
      console.error('Polygon ticker details error:', error);
      throw error;
    }
  }

  /**
   * Search for tickers
   * @param {string} search - Search query
   * @param {string} type - Ticker type (CS for stocks)
   * @param {boolean} active - Active tickers only
   * @returns {Promise<Array>} Search results
   */
  async searchTickers(search, type = 'CS', active = true) {
    try {
      const response = await axios.get(
        `${this.baseURL}/v3/reference/tickers`,
        {
          params: {
            search,
            type,
            active,
            limit: 20,
            apikey: this.apiKey
          }
        }
      );

      return this.formatSearchResults(response.data.results);
    } catch (error) {
      console.error('Polygon search error:', error);
      throw error;
    }
  }

  /**
   * Get gainers and losers
   * @param {string} direction - 'gainers' or 'losers'
   * @returns {Promise<Array>} Gainers or losers data
   */
  async getGainersLosers(direction = 'gainers') {
    try {
      const response = await axios.get(
        `${this.baseURL}/v2/snapshot/locale/us/markets/stocks/${direction}`,
        {
          params: { apikey: this.apiKey }
        }
      );

      return this.formatGainersLosers(response.data.results, direction);
    } catch (error) {
      console.error(`Polygon ${direction} error:`, error);
      throw error;
    }
  }

  // Data formatting methods
  formatQuoteData(data, symbol) {
    const result = data.results;
    if (!result) return { error: 'No quote data available' };

    return {
      symbol,
      price: result.p || 0,
      size: result.s || 0,
      exchange: result.x || 0,
      timestamp: result.t || 0,
      timeframe: result.f || 0,
      sequence: result.q || 0,
      participant_timestamp: result.y || 0
    };
  }

  formatAggregatesData(data, symbol) {
    if (!data.results) return { error: 'No aggregates data available' };

    const candles = data.results.map(bar => ({
      time: Math.floor(bar.t / 1000), // Convert to seconds for lightweight-charts
      open: bar.o || 0,
      high: bar.h || 0,
      low: bar.l || 0,
      close: bar.c || 0,
      volume: bar.v || 0
    }));

    return {
      symbol,
      resultsCount: data.resultsCount,
      queryCount: data.queryCount,
      adjusted: data.adjusted,
      candles,
      status: data.status,
      request_id: data.request_id,
      next_url: data.next_url
    };
  }

  formatDailyData(data) {
    return {
      status: data.status,
      from: data.from,
      symbol: data.symbol,
      open: data.open || 0,
      high: data.high || 0,
      low: data.low || 0,
      close: data.close || 0,
      volume: data.volume || 0,
      afterHours: data.afterHours || 0,
      preMarket: data.preMarket || 0
    };
  }

  formatTickerDetails(data) {
    if (!data) return { error: 'No ticker details available' };

    return {
      ticker: data.ticker,
      name: data.name,
      market: data.market,
      locale: data.locale,
      primaryExchange: data.primary_exchange,
      type: data.type,
      active: data.active,
      currencyName: data.currency_name,
      marketCap: data.market_cap,
      description: data.description,
      homepageUrl: data.homepage_url,
      totalEmployees: data.total_employees,
      listDate: data.list_date
    };
  }

  formatSearchResults(results) {
    if (!results) return [];

    return results.map(ticker => ({
      ticker: ticker.ticker,
      name: ticker.name,
      market: ticker.market,
      locale: ticker.locale,
      primaryExchange: ticker.primary_exchange,
      type: ticker.type,
      active: ticker.active,
      currencyName: ticker.currency_name,
      lastUpdatedUtc: ticker.last_updated_utc
    }));
  }

  formatGainersLosers(results, direction) {
    if (!results) return [];

    return results.map(stock => ({
      ticker: stock.ticker,
      todaysChangePerc: stock.todaysChangePerc || 0,
      todaysChange: stock.todaysChange || 0,
      updated: stock.updated,
      day: {
        change: stock.day?.c || 0,
        changePercent: stock.day?.changePercent || 0,
        close: stock.day?.c || 0,
        high: stock.day?.h || 0,
        low: stock.day?.l || 0,
        open: stock.day?.o || 0,
        previousClose: stock.day?.pc || 0,
        volume: stock.day?.v || 0
      },
      lastQuote: {
        price: stock.lastQuote?.p || 0,
        size: stock.lastQuote?.s || 0,
        exchange: stock.lastQuote?.x || 0,
        timestamp: stock.lastQuote?.t || 0
      },
      marketStatus: stock.marketStatus
    }));
  }

  /**
   * Health check for Polygon service
   */
  async healthCheck() {
    try {
      const response = await this.getMarketStatus();
      return { status: 'healthy', service: 'Polygon.io', marketStatus: response.market };
    } catch (error) {
      if (error.response?.status === 429) {
        return { status: 'rate_limited', message: 'API rate limit exceeded', service: 'Polygon.io' };
      }
      return { status: 'error', message: error.message, service: 'Polygon.io' };
    }
  }
}

export default new PolygonService();