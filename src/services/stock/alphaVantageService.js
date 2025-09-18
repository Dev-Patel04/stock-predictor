import axios from 'axios';

class AlphaVantageService {
  constructor() {
    this.baseURL = 'https://www.alphavantage.co/query';
    this.apiKey = import.meta.env.VITE_ALPHA_VANTAGE_KEY;
  }

  /**
   * Get intraday stock data
   * @param {string} symbol - Stock symbol
   * @param {string} interval - Time interval (1min, 5min, 15min, 30min, 60min)
   * @returns {Promise<Object>} Intraday stock data
   */
  async getIntradayData(symbol, interval = '5min') {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'TIME_SERIES_INTRADAY',
          symbol,
          interval,
          apikey: this.apiKey,
          outputsize: 'compact'
        }
      });

      return this.formatIntradayData(response.data, interval);
    } catch (error) {
      console.error('Alpha Vantage intraday error:', error);
      throw error;
    }
  }

  /**
   * Get daily stock data
   * @param {string} symbol - Stock symbol
   * @param {string} outputsize - 'compact' (100 days) or 'full' (20+ years)
   * @returns {Promise<Object>} Daily stock data
   */
  async getDailyData(symbol, outputsize = 'compact') {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'TIME_SERIES_DAILY',
          symbol,
          apikey: this.apiKey,
          outputsize
        }
      });

      return this.formatDailyData(response.data);
    } catch (error) {
      console.error('Alpha Vantage daily error:', error);
      throw error;
    }
  }

  /**
   * Get technical indicators
   * @param {string} symbol - Stock symbol
   * @param {string} indicator - Technical indicator type
   * @param {Object} params - Additional parameters for the indicator
   * @returns {Promise<Object>} Technical indicator data
   */
  async getTechnicalIndicator(symbol, indicator, params = {}) {
    try {
      const defaultParams = {
        function: indicator,
        symbol,
        interval: 'daily',
        time_period: 14,
        series_type: 'close',
        apikey: this.apiKey,
        ...params
      };

      const response = await axios.get(this.baseURL, {
        params: defaultParams
      });

      return this.formatTechnicalData(response.data, indicator);
    } catch (error) {
      console.error(`Alpha Vantage ${indicator} error:`, error);
      throw error;
    }
  }

  /**
   * Get RSI (Relative Strength Index)
   * @param {string} symbol - Stock symbol
   * @param {number} timePeriod - Time period for RSI calculation
   * @returns {Promise<Object>} RSI data
   */
  async getRSI(symbol, timePeriod = 14) {
    return this.getTechnicalIndicator(symbol, 'RSI', {
      time_period: timePeriod,
      interval: 'daily',
      series_type: 'close'
    });
  }

  /**
   * Get MACD (Moving Average Convergence Divergence)
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} MACD data
   */
  async getMACD(symbol) {
    return this.getTechnicalIndicator(symbol, 'MACD', {
      interval: 'daily',
      series_type: 'close',
      fastperiod: 12,
      slowperiod: 26,
      signalperiod: 9
    });
  }

  /**
   * Get Moving Average
   * @param {string} symbol - Stock symbol
   * @param {string} type - 'SMA' or 'EMA'
   * @param {number} timePeriod - Time period for moving average
   * @returns {Promise<Object>} Moving average data
   */
  async getMovingAverage(symbol, type = 'SMA', timePeriod = 20) {
    return this.getTechnicalIndicator(symbol, type, {
      time_period: timePeriod,
      interval: 'daily',
      series_type: 'close'
    });
  }

  /**
   * Get Bollinger Bands
   * @param {string} symbol - Stock symbol
   * @param {number} timePeriod - Time period for calculation
   * @returns {Promise<Object>} Bollinger Bands data
   */
  async getBollingerBands(symbol, timePeriod = 20) {
    return this.getTechnicalIndicator(symbol, 'BBANDS', {
      time_period: timePeriod,
      interval: 'daily',
      series_type: 'close',
      nbdevup: 2,
      nbdevdn: 2,
      matype: 0
    });
  }

  /**
   * Get company overview
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Company fundamental data
   */
  async getCompanyOverview(symbol) {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'OVERVIEW',
          symbol,
          apikey: this.apiKey
        }
      });

      return this.formatCompanyData(response.data);
    } catch (error) {
      console.error('Alpha Vantage overview error:', error);
      throw error;
    }
  }

  /**
   * Get earnings data
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Earnings data
   */
  async getEarnings(symbol) {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'EARNINGS',
          symbol,
          apikey: this.apiKey
        }
      });

      return this.formatEarningsData(response.data);
    } catch (error) {
      console.error('Alpha Vantage earnings error:', error);
      throw error;
    }
  }

  /**
   * Get market news and sentiment
   * @param {Array} tickers - Array of stock symbols
   * @param {string} timeFrom - Start time (YYYYMMDDTHHMM)
   * @param {string} timeTo - End time (YYYYMMDDTHHMM)
   * @returns {Promise<Object>} News and sentiment data
   */
  async getNewsAndSentiment(tickers = [], timeFrom = null, timeTo = null) {
    try {
      const params = {
        function: 'NEWS_SENTIMENT',
        apikey: this.apiKey,
        limit: 50
      };

      if (tickers.length > 0) {
        params.tickers = tickers.join(',');
      }
      if (timeFrom) params.time_from = timeFrom;
      if (timeTo) params.time_to = timeTo;

      const response = await axios.get(this.baseURL, { params });

      return this.formatNewsData(response.data);
    } catch (error) {
      console.error('Alpha Vantage news error:', error);
      throw error;
    }
  }

  // Data formatting methods
  formatIntradayData(data, interval) {
    const timeSeries = data[`Time Series (${interval})`];
    if (!timeSeries) return { error: 'No data available', data };

    const prices = Object.entries(timeSeries).map(([timestamp, values]) => ({
      time: new Date(timestamp).getTime() / 1000,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    })).reverse(); // Reverse to get chronological order

    return {
      symbol: data['Meta Data']['2. Symbol'],
      interval,
      lastRefreshed: data['Meta Data']['3. Last Refreshed'],
      prices,
      count: prices.length
    };
  }

  formatDailyData(data) {
    const timeSeries = data['Time Series (Daily)'];
    if (!timeSeries) return { error: 'No data available', data };

    const prices = Object.entries(timeSeries).map(([date, values]) => ({
      time: new Date(date).getTime() / 1000,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume'])
    })).reverse();

    return {
      symbol: data['Meta Data']['2. Symbol'],
      lastRefreshed: data['Meta Data']['3. Last Refreshed'],
      prices,
      count: prices.length
    };
  }

  formatTechnicalData(data, indicator) {
    const technicalKey = Object.keys(data).find(key => key.includes('Technical'));
    const technicalData = data[technicalKey];
    
    if (!technicalData) return { error: 'No technical data available', data };

    const values = Object.entries(technicalData).map(([date, values]) => {
      const result = { time: new Date(date).getTime() / 1000 };
      Object.entries(values).forEach(([key, value]) => {
        const cleanKey = key.replace(/^\d+\.\s*/, ''); // Remove "1. " prefix
        result[cleanKey] = parseFloat(value);
      });
      return result;
    }).reverse();

    return {
      indicator,
      symbol: data['Meta Data']['1: Symbol'],
      values,
      count: values.length
    };
  }

  formatCompanyData(data) {
    return {
      symbol: data.Symbol,
      name: data.Name,
      description: data.Description,
      sector: data.Sector,
      industry: data.Industry,
      marketCap: parseFloat(data.MarketCapitalization) || 0,
      peRatio: parseFloat(data.PERatio) || 0,
      pegRatio: parseFloat(data.PEGRatio) || 0,
      bookValue: parseFloat(data.BookValue) || 0,
      dividendPerShare: parseFloat(data.DividendPerShare) || 0,
      dividendYield: parseFloat(data.DividendYield) || 0,
      eps: parseFloat(data.EPS) || 0,
      revenuePerShareTTM: parseFloat(data.RevenuePerShareTTM) || 0,
      profitMargin: parseFloat(data.ProfitMargin) || 0,
      operatingMarginTTM: parseFloat(data.OperatingMarginTTM) || 0,
      returnOnAssetsTTM: parseFloat(data.ReturnOnAssetsTTM) || 0,
      returnOnEquityTTM: parseFloat(data.ReturnOnEquityTTM) || 0,
      revenueTTM: parseFloat(data.RevenueTTM) || 0,
      grossProfitTTM: parseFloat(data.GrossProfitTTM) || 0,
      weekHigh52: parseFloat(data['52WeekHigh']) || 0,
      weekLow52: parseFloat(data['52WeekLow']) || 0,
      movingAverage50: parseFloat(data['50DayMovingAverage']) || 0,
      movingAverage200: parseFloat(data['200DayMovingAverage']) || 0
    };
  }

  formatEarningsData(data) {
    return {
      symbol: data.symbol,
      annualEarnings: data.annualEarnings || [],
      quarterlyEarnings: data.quarterlyEarnings || []
    };
  }

  formatNewsData(data) {
    return {
      items: data.items || 0,
      sentiment_score_definition: data.sentiment_score_definition,
      relevance_score_definition: data.relevance_score_definition,
      feed: (data.feed || []).map(article => ({
        title: article.title,
        url: article.url,
        timePublished: article.time_published,
        authors: article.authors || [],
        summary: article.summary,
        bannerImage: article.banner_image,
        source: article.source,
        categoryWithinSource: article.category_within_source,
        sourceDomain: article.source_domain,
        topics: article.topics || [],
        overallSentimentScore: parseFloat(article.overall_sentiment_score) || 0,
        overallSentimentLabel: article.overall_sentiment_label,
        tickerSentiment: article.ticker_sentiment || []
      }))
    };
  }

  /**
   * Health check for Alpha Vantage service
   */
  async healthCheck() {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          function: 'GLOBAL_QUOTE',
          symbol: 'AAPL',
          apikey: this.apiKey
        }
      });
      
      if (response.data['Global Quote']) {
        return { status: 'healthy', service: 'Alpha Vantage' };
      } else if (response.data['Note']) {
        return { status: 'rate_limited', message: response.data['Note'], service: 'Alpha Vantage' };
      } else {
        return { status: 'error', message: 'Unexpected response', service: 'Alpha Vantage' };
      }
    } catch (error) {
      return { status: 'error', message: error.message, service: 'Alpha Vantage' };
    }
  }
}

export default new AlphaVantageService();