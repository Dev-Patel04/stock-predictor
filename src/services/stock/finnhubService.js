import axios from 'axios';

class FinnhubService {
  constructor() {
    // Use proxy in development, direct API in production
    this.baseURL = import.meta.env.DEV ? '/api/finnhub' : 'https://finnhub.io/api/v1';
    this.apiKey = import.meta.env.VITE_FINNHUB_KEY || 'demo';
    
    // Debug: Check if API key is loaded
    console.log('Finnhub Service initialized with:');
    console.log('- Base URL:', this.baseURL);
    console.log('- API key:', this.apiKey ? 'Key loaded' : 'No key found');
    console.log('- Environment:', import.meta.env.DEV ? 'Development' : 'Production');
  }

  /**
   * Get real-time stock quote
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Stock quote data
   */
  async getQuote(symbol) {
    try {
      console.log(`Making Finnhub request for ${symbol} with token: ${this.apiKey ? 'Present' : 'Missing'}`);
      
      const url = `${this.baseURL}/quote?symbol=${symbol.toUpperCase()}&token=${this.apiKey}`;
      console.log('Request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      console.log(`Finnhub response for ${symbol}:`, response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Response data:', data);
      
      return this.formatQuoteData(data, symbol);
    } catch (error) {
      console.error(`Finnhub quote error for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get multiple stock quotes in batch
   * @param {Array} symbols - Array of stock symbols
   * @returns {Promise<Array>} Array of stock quotes
   */
  async getBatchQuotes(symbols) {
    const quotes = [];
    
    for (const symbol of symbols) {
      try {
        const quote = await this.getQuote(symbol);
        if (quote && quote.currentPrice > 0) {
          quotes.push(quote);
        }
        
        // Small delay to respect rate limits (60/min = 1 per second)
        await new Promise(resolve => setTimeout(resolve, 1100));
      } catch (error) {
        console.warn(`Failed to get quote for ${symbol}:`, error.message);
      }
    }
    
    return quotes;
  }

  /**
   * Get market news
   * @param {string} category - News category ('general', 'forex', 'crypto', 'merger')
   * @returns {Promise<Array>} News articles
   */
  async getMarketNews(category = 'general') {
    try {
      const response = await axios.get(`${this.baseURL}/news`, {
        params: {
          category,
          token: this.apiKey
        }
      });

      return this.formatNewsData(response.data);
    } catch (error) {
      console.error('Finnhub news error:', error);
      throw error;
    }
  }

  /**
   * Get company profile
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Company profile data
   */
  async getCompanyProfile(symbol) {
    try {
      const response = await axios.get(`${this.baseURL}/stock/profile2`, {
        params: {
          symbol: symbol.toUpperCase(),
          token: this.apiKey
        }
      });

      return this.formatCompanyProfile(response.data);
    } catch (error) {
      console.error(`Finnhub company profile error for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get historical candle data
   * @param {string} symbol - Stock symbol
   * @param {string} resolution - Resolution ('1', '5', '15', '30', '60', 'D', 'W', 'M')
   * @param {number} from - From timestamp
   * @param {number} to - To timestamp
   * @returns {Promise<Object>} Candle data
   */
  async getCandles(symbol, resolution = 'D', from, to) {
    try {
      const url = `${this.baseURL}/stock/candle?symbol=${symbol.toUpperCase()}&resolution=${resolution}&from=${from}&to=${to}&token=${this.apiKey}`;
      console.log('Candles request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return this.formatCandleData(data, symbol);
    } catch (error) {
      console.error(`Finnhub candle error for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get basic financials
   * @param {string} symbol - Stock symbol
   * @param {string} metric - Metric type ('all' or specific metric)
   * @returns {Promise<Object>} Financial metrics
   */
  async getBasicFinancials(symbol, metric = 'all') {
    try {
      const response = await axios.get(`${this.baseURL}/stock/metric`, {
        params: {
          symbol: symbol.toUpperCase(),
          metric,
          token: this.apiKey
        }
      });

      return this.formatFinancialData(response.data);
    } catch (error) {
      console.error(`Finnhub financials error for ${symbol}:`, error);
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
      const response = await axios.get(`${this.baseURL}/search`, {
        params: {
          q: query,
          token: this.apiKey
        }
      });

      return this.formatSearchResults(response.data);
    } catch (error) {
      console.error('Finnhub search error:', error);
      throw error;
    }
  }

  // Data formatting methods
  formatQuoteData(data, symbol) {
    if (!data || typeof data.c !== 'number') {
      return null;
    }

    return {
      symbol: symbol.toUpperCase(),
      currentPrice: data.c, // Current price
      change: data.d || 0, // Change
      changePercent: data.dp || 0, // Change percent
      high: data.h || data.c, // High price of the day
      low: data.l || data.c, // Low price of the day
      open: data.o || data.c, // Open price of the day
      previousClose: data.pc || data.c, // Previous close price
      timestamp: Date.now(),
      source: 'Finnhub'
    };
  }

  formatCandleData(data, symbol) {
    if (!data || data.s !== 'ok' || !data.c || data.c.length === 0) {
      return { error: 'No candle data available', symbol };
    }

    const candles = [];
    for (let i = 0; i < data.c.length; i++) {
      candles.push({
        time: data.t[i],
        open: data.o[i],
        high: data.h[i],
        low: data.l[i],
        close: data.c[i],
        volume: data.v[i]
      });
    }

    return {
      symbol: symbol.toUpperCase(),
      candles,
      count: candles.length
    };
  }

  formatNewsData(data) {
    if (!Array.isArray(data)) return [];

    return data.slice(0, 10).map(article => ({
      title: article.headline,
      summary: article.summary,
      url: article.url,
      source: article.source,
      publishedAt: new Date(article.datetime * 1000).toISOString(),
      image: article.image,
      category: article.category,
      sentiment: article.sentiment
    }));
  }

  formatCompanyProfile(data) {
    return {
      name: data.name,
      ticker: data.ticker,
      country: data.country,
      currency: data.currency,
      exchange: data.exchange,
      industry: data.finnhubIndustry,
      marketCap: data.marketCapitalization,
      shareOutstanding: data.shareOutstanding,
      logo: data.logo,
      phone: data.phone,
      weburl: data.weburl,
      ipo: data.ipo
    };
  }

  formatFinancialData(data) {
    const metrics = data.metric || {};
    return {
      peRatio: metrics.peBasicExclExtraTTM,
      pegRatio: metrics.pegRatio,
      bookValue: metrics.bookValuePerShareQuarterly,
      eps: metrics.epsBasicExclExtraTTM,
      dividendYield: metrics.dividendYieldIndicatedAnnual,
      profitMargin: metrics.netProfitMarginTTM,
      operatingMargin: metrics.operatingMarginTTM,
      returnOnEquity: metrics.roeTTM,
      returnOnAssets: metrics.roaTTM,
      debtToEquity: metrics.totalDebtToTotalEquityQuarterly,
      currentRatio: metrics.currentRatioQuarterly,
      quickRatio: metrics.quickRatioQuarterly,
      revenue: metrics.revenueTTM,
      grossProfit: metrics.grossProfitTTM
    };
  }

  formatSearchResults(data) {
    if (!data.result) return [];

    return data.result.map(result => ({
      symbol: result.symbol,
      description: result.description,
      displaySymbol: result.displaySymbol,
      type: result.type
    }));
  }

  /**
   * Health check for Finnhub service
   */
  async healthCheck() {
    try {
      const response = await this.getQuote('AAPL');
      
      if (response && response.currentPrice > 0) {
        return { status: 'healthy', service: 'Finnhub' };
      } else {
        return { status: 'error', message: 'Invalid response', service: 'Finnhub' };
      }
    } catch (error) {
      if (error.response?.status === 429) {
        return { status: 'rate_limited', message: 'Rate limit exceeded', service: 'Finnhub' };
      }
      return { status: 'error', message: error.message, service: 'Finnhub' };
    }
  }

  /**
   * Get market status
   */
  getMarketStatus() {
    const now = new Date();
    const nyTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    const hour = nyTime.getHours();
    const day = nyTime.getDay();
    
    const isWeekday = day >= 1 && day <= 5;
    const isMarketHours = hour >= 9 && hour < 16; // 9:30 AM - 4:00 PM EST
    const isPreMarket = hour >= 4 && hour < 9;
    const isAfterHours = hour >= 16 && hour < 20;
    
    if (isWeekday && isMarketHours) {
      return { market: 'open', status: 'Market is open' };
    } else if (isWeekday && (isPreMarket || isAfterHours)) {
      return { market: 'extended-hours', status: 'Extended hours trading' };
    } else {
      return { market: 'closed', status: 'Market is closed' };
    }
  }
}

export default new FinnhubService();