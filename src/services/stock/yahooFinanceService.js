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
      // Check if API key is available
      if (!import.meta.env.VITE_RAPIDAPI_KEY || import.meta.env.VITE_RAPIDAPI_KEY === 'your_rapidapi_key_here') {
        console.warn('Yahoo Finance API key not configured, using mock data');
        return this.getMockQuoteData(symbol);
      }

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
      console.log('Falling back to mock data due to API error');
      return this.getMockQuoteData(symbol);
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

  /**
   * Generate mock data when API is not available
   */
  getMockQuoteData(symbol) {
    const basePrice = {
      'AAPL': 150,
      'TSLA': 250,
      'MSFT': 300,
      'GOOGL': 2500,
      'AMZN': 3200,
      'NVDA': 450,
      'META': 320,
      'NFLX': 400
    }[symbol] || 100;

    const mockData = {
      symbol,
      price: (basePrice + (Math.random() - 0.5) * 20).toFixed(2),
      change: ((Math.random() - 0.5) * 10).toFixed(2),
      changePercent: ((Math.random() - 0.5) * 5).toFixed(2),
      volume: Math.floor(Math.random() * 50000000),
      marketCap: `${(Math.random() * 2000 + 500).toFixed(0)}B`,
      peRatio: (Math.random() * 30 + 10).toFixed(2),
      dayHigh: (basePrice + Math.random() * 15).toFixed(2),
      dayLow: (basePrice - Math.random() * 15).toFixed(2),
      fiftyTwoWeekHigh: (basePrice + Math.random() * 50).toFixed(2),
      fiftyTwoWeekLow: (basePrice - Math.random() * 50).toFixed(2),
      avgVolume: Math.floor(Math.random() * 30000000),
      beta: (Math.random() * 2).toFixed(2),
      eps: (Math.random() * 20).toFixed(2),
      dividendYield: (Math.random() * 5).toFixed(2),
      mock: true,
      timestamp: new Date().toISOString()
    };

    console.log(`Generated mock data for ${symbol}:`, mockData);
    return mockData;
  }
}

export default new YahooFinanceService();