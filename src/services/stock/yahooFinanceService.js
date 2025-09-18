import axios from 'axios';

class YahooFinanceService {
  constructor() {
    this.baseURL = 'https://apidojo-yahoo-finance-v1.p.rapidapi.com';
    this.headers = {
      'x-rapidapi-host': 'apidojo-yahoo-finance-v1.p.rapidapi.com',
      'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY
    };
  }

  /**
   * Get real-time stock quote
   * @param {string} symbol - Stock symbol (e.g., 'AAPL', 'TSLA')
   * @returns {Promise<Object>} Stock quote data
   */
  async getStockQuote(symbol) {
    try {
      const response = await axios.get(
        `${this.baseURL}/stock/v2/get-summary`,
        {
          params: { symbol, region: 'US' },
          headers: this.headers
        }
      );
      
      return this.formatQuoteData(response.data);
    } catch (error) {
      console.error('Yahoo Finance quote error:', error);
      throw error;
    }
  }

  /**
   * Get historical stock data (time series)
   * @param {string} symbol - Stock symbol
   * @param {string} period1 - Start timestamp
   * @param {string} period2 - End timestamp
   * @param {string} interval - Data interval ('1d', '1wk', '1mo')
   * @returns {Promise<Object>} Historical data
   */
  async getHistoricalData(symbol, period1, period2, interval = '1d') {
    try {
      const response = await axios.get(
        `${this.baseURL}/stock/v2/get-timeseries`,
        {
          params: { symbol, region: 'US', period1, period2, interval },
          headers: this.headers
        }
      );
      
      return this.formatHistoricalData(response.data);
    } catch (error) {
      console.error('Yahoo Finance historical data error:', error);
      throw error;
    }
  }

  /**
   * Get stock options data
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Options chain data
   */
  async getOptionsData(symbol) {
    try {
      const response = await axios.get(
        `${this.baseURL}/stock/v2/get-options`,
        {
          params: { symbol, region: 'US' },
          headers: this.headers
        }
      );
      
      return this.formatOptionsData(response.data);
    } catch (error) {
      console.error('Yahoo Finance options error:', error);
      throw error;
    }
  }

  /**
   * Search for stocks
   * @param {string} query - Search query
   * @returns {Promise<Array>} Search results
   */
  async searchStocks(query) {
    try {
      const response = await axios.get(
        `${this.baseURL}/auto-complete`,
        {
          params: { q: query, region: 'US' },
          headers: this.headers
        }
      );
      
      return this.formatSearchResults(response.data);
    } catch (error) {
      console.error('Yahoo Finance search error:', error);
      throw error;
    }
  }

  /**
   * Get company financials
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Financial data
   */
  async getFinancials(symbol) {
    try {
      const response = await axios.get(
        `${this.baseURL}/stock/v2/get-financials`,
        {
          params: { symbol, region: 'US' },
          headers: this.headers
        }
      );
      
      return this.formatFinancialData(response.data);
    } catch (error) {
      console.error('Yahoo Finance financials error:', error);
      throw error;
    }
  }

  /**
   * Get company news
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Array>} News articles
   */
  async getStockNews(symbol) {
    try {
      const response = await axios.get(
        `${this.baseURL}/stock/get-news`,
        {
          params: { category: symbol, region: 'US' },
          headers: this.headers
        }
      );
      
      return this.formatNewsData(response.data);
    } catch (error) {
      console.error('Yahoo Finance news error:', error);
      throw error;
    }
  }

  /**
   * Get market summary
   * @returns {Promise<Object>} Market indices and summary
   */
  async getMarketSummary() {
    try {
      const response = await axios.get(
        `${this.baseURL}/market/v2/get-summary`,
        {
          params: { region: 'US' },
          headers: this.headers
        }
      );
      
      return this.formatMarketData(response.data);
    } catch (error) {
      console.error('Yahoo Finance market summary error:', error);
      throw error;
    }
  }

  // Data formatting methods
  formatQuoteData(data) {
    const price = data.price;
    const summary = data.summaryDetail;
    
    return {
      symbol: data.symbol,
      currentPrice: price?.regularMarketPrice?.raw || 0,
      change: price?.regularMarketChange?.raw || 0,
      changePercent: price?.regularMarketChangePercent?.raw || 0,
      volume: price?.regularMarketVolume?.raw || 0,
      marketCap: summary?.marketCap?.raw || 0,
      peRatio: summary?.trailingPE?.raw || 0,
      dayHigh: price?.regularMarketDayHigh?.raw || 0,
      dayLow: price?.regularMarketDayLow?.raw || 0,
      yearHigh: summary?.fiftyTwoWeekHigh?.raw || 0,
      yearLow: summary?.fiftyTwoWeekLow?.raw || 0,
      dividendYield: summary?.dividendYield?.raw || 0,
      timestamp: new Date().toISOString()
    };
  }

  formatHistoricalData(data) {
    const chart = data.chart?.result?.[0];
    if (!chart) return { prices: [], volume: [] };

    const timestamps = chart.timestamp || [];
    const quotes = chart.indicators?.quote?.[0] || {};
    
    const prices = timestamps.map((timestamp, index) => ({
      time: timestamp,
      open: quotes.open?.[index] || 0,
      high: quotes.high?.[index] || 0,
      low: quotes.low?.[index] || 0,
      close: quotes.close?.[index] || 0,
      volume: quotes.volume?.[index] || 0
    }));

    return {
      symbol: chart.meta?.symbol,
      prices,
      currency: chart.meta?.currency,
      timezone: chart.meta?.timezone,
      interval: chart.meta?.dataGranularity
    };
  }

  formatOptionsData(data) {
    const options = data.optionChain?.result?.[0]?.options?.[0] || {};
    
    return {
      calls: options.calls?.map(call => ({
        strike: call.strike?.raw || 0,
        bid: call.bid?.raw || 0,
        ask: call.ask?.raw || 0,
        volume: call.volume?.raw || 0,
        impliedVolatility: call.impliedVolatility?.raw || 0,
        expiration: call.expiration?.raw || 0
      })) || [],
      puts: options.puts?.map(put => ({
        strike: put.strike?.raw || 0,
        bid: put.bid?.raw || 0,
        ask: put.ask?.raw || 0,
        volume: put.volume?.raw || 0,
        impliedVolatility: put.impliedVolatility?.raw || 0,
        expiration: put.expiration?.raw || 0
      })) || []
    };
  }

  formatSearchResults(data) {
    return data.quotes?.map(quote => ({
      symbol: quote.symbol,
      name: quote.shortname || quote.longname,
      type: quote.quoteType,
      exchange: quote.exchange
    })) || [];
  }

  formatFinancialData(data) {
    return {
      income: data.incomeStatementHistory?.incomeStatementHistory || [],
      balance: data.balanceSheetHistory?.balanceSheetStatements || [],
      cashFlow: data.cashflowStatementHistory?.cashflowStatements || []
    };
  }

  formatNewsData(data) {
    return data.items?.news?.map(article => ({
      title: article.title,
      summary: article.summary,
      publisher: article.publisher,
      link: article.link,
      publishTime: article.providerPublishTime,
      thumbnail: article.thumbnail?.resolutions?.[0]?.url
    })) || [];
  }

  formatMarketData(data) {
    return data.marketSummaryResponse?.result?.map(market => ({
      symbol: market.symbol,
      name: market.shortName,
      price: market.regularMarketPrice?.raw || 0,
      change: market.regularMarketChange?.raw || 0,
      changePercent: market.regularMarketChangePercent?.raw || 0
    })) || [];
  }

  /**
   * Health check for Yahoo Finance service
   */
  async healthCheck() {
    try {
      await this.getStockQuote('AAPL');
      return { status: 'healthy', service: 'Yahoo Finance' };
    } catch (error) {
      return { status: 'error', message: error.message, service: 'Yahoo Finance' };
    }
  }
}

export default new YahooFinanceService();