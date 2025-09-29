class TwelveDataService {
  constructor() {
    // Use proxy in development, direct API in production
    this.baseURL = import.meta.env.DEV ? '/api/twelvedata' : 'https://api.twelvedata.com';
    this.apiKey = import.meta.env.VITE_TWELVE_DATA_KEY;
    
    // Cache to store API responses and avoid unnecessary calls
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
    this.dailyRequests = 0;
    this.maxDailyRequests = 800; // Free tier limit
    
    console.log('Twelve Data Service initialized with:');
    console.log('- Base URL:', this.baseURL);
    console.log('- API key:', this.apiKey ? 'Present' : 'Missing');
    console.log('- Environment:', import.meta.env.DEV ? 'Development' : 'Production');
    console.log('- Cache enabled with 5min expiry');
  }

  /**
   * Check if we have cached data for this request
   * @param {string} cacheKey - Unique key for this request
   * @returns {Array|null} Cached data or null
   */
  getCachedData(cacheKey) {
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      console.log(`🎯 Using cached data for ${cacheKey}`);
      return cached.data;
    }
    return null;
  }

  /**
   * Store data in cache
   * @param {string} cacheKey - Unique key for this request
   * @param {Array} data - Data to cache
   */
  setCachedData(cacheKey, data) {
    this.cache.set(cacheKey, {
      data: data,
      timestamp: Date.now()
    });
    console.log(`💾 Cached data for ${cacheKey}`);
  }

  /**
   * Get time series data for charts with caching
   * @param {string} symbol - Stock symbol
   * @param {string} interval - Time interval (1min, 5min, 15min, 30min, 1h, 1day, etc.)
   * @param {number} outputsize - Number of data points to return
   * @returns {Promise<Array>} Chart data formatted for TradingView
   */
  async getTimeSeries(symbol, interval, outputsize = 100) {
    const cacheKey = `${symbol}_${interval}_${outputsize}`;
    
    // Check cache first
    const cachedData = this.getCachedData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Check daily request limit
    if (this.dailyRequests >= this.maxDailyRequests) {
      console.warn(`⚠️ Daily request limit reached (${this.maxDailyRequests}). Using cached data only.`);
      throw new Error('Daily API limit reached. Please try again tomorrow.');
    }

    try {
      console.log(`📊 Fetching ${symbol} data: ${interval} interval, ${outputsize} points (Request #${this.dailyRequests + 1})`);
      
      const url = `${this.baseURL}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${this.apiKey}`;
      
      const response = await fetch(url);
      this.dailyRequests++; // Increment counter
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'API returned error');
      }
      
      if (!data.values || !Array.isArray(data.values)) {
        throw new Error('No time series data available');
      }
      
      console.log(`✅ Received ${data.values.length} data points for ${symbol} (${this.dailyRequests}/${this.maxDailyRequests} requests used)`);
      
      const formattedData = this.formatForTradingView(data.values);
      
      // Cache the formatted data
      this.setCachedData(cacheKey, formattedData);
      
      return formattedData;
    } catch (error) {
      console.error(`Twelve Data error for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Get real-time quote (backup for Finnhub)
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Quote data
   */
  async getQuote(symbol) {
    try {
      const url = `${this.baseURL}/quote?symbol=${symbol}&apikey=${this.apiKey}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Quote API returned error');
      }
      
      return {
        symbol: data.symbol,
        currentPrice: parseFloat(data.close),
        change: parseFloat(data.change),
        changePercent: parseFloat(data.percent_change),
        high: parseFloat(data.high),
        low: parseFloat(data.low),
        open: parseFloat(data.open),
        previousClose: parseFloat(data.previous_close),
        timestamp: Date.now(),
        source: 'Twelve Data'
      };
    } catch (error) {
      console.error(`Twelve Data quote error for ${symbol}:`, error);
      throw error;
    }
  }

  /**
   * Format Twelve Data response for TradingView Lightweight Charts
   * @param {Array} values - Raw time series data from Twelve Data
   * @returns {Array} Formatted data for TradingView
   */
  formatForTradingView(values) {
    console.log('🔄 Formatting data for TradingView. Sample raw data:', values.slice(0, 2));
    
    const formattedData = values
      .map(item => {
        try {
          // TradingView requires time as UNIX timestamp (seconds) or YYYY-MM-DD format
          let time;
          if (item.datetime.includes('T')) {
            // For intraday data with time (e.g., "2023-12-01T09:30:00")
            time = Math.floor(new Date(item.datetime).getTime() / 1000); // Convert to UNIX timestamp
          } else {
            // For daily data (e.g., "2023-12-01")
            time = item.datetime; // Keep YYYY-MM-DD format
          }
          
          const formatted = {
            time: time,
            open: parseFloat(item.open),
            high: parseFloat(item.high),
            low: parseFloat(item.low),
            close: parseFloat(item.close),
            volume: item.volume ? parseInt(item.volume) : 0
          };
          
          return formatted;
        } catch (error) {
          console.warn('Error formatting data point:', item, error);
          return null;
        }
      })
      .filter(item => item !== null)
      .sort((a, b) => {
        // Sort chronologically
        const timeA = typeof a.time === 'string' ? new Date(a.time) : new Date(a.time * 1000);
        const timeB = typeof b.time === 'string' ? new Date(b.time) : new Date(b.time * 1000);
        return timeA - timeB;
      });
    
    console.log('✅ Formatted data for TradingView. Sample:', formattedData.slice(0, 2));
    console.log('📈 Total formatted points:', formattedData.length);
    
    return formattedData;
  }

  /**
   * Get timeframe configuration for different chart periods
   * @param {string} timeframe - Timeframe (1D, 5D, 1M, 3M, 6M, 1Y)
   * @returns {Object} Configuration for API call
   */
  getTimeframeConfig(timeframe) {
    const configs = {
      '1D': { interval: '5min', outputsize: 78 },   // 1 day, 5min candles (6.5 hours * 12)
      '5D': { interval: '15min', outputsize: 130 }, // 5 days, 15min candles 
      '1M': { interval: '1day', outputsize: 30 },   // 1 month, daily candles
      '3M': { interval: '1day', outputsize: 90 },   // 3 months, daily candles
      '6M': { interval: '1day', outputsize: 180 },  // 6 months, daily candles
      '1Y': { interval: '1day', outputsize: 365 }   // 1 year, daily candles
    };

    return configs[timeframe] || configs['1M']; // Default to 1M
  }

  /**
   * Get historical data for a specific timeframe
   * @param {string} symbol - Stock symbol
   * @param {string} timeframe - Timeframe (1D, 5D, 1M, 3M, 6M, 1Y)
   * @returns {Promise<Array>} Chart data for TradingView
   */
  async getHistoricalData(symbol, timeframe) {
    const config = this.getTimeframeConfig(timeframe);
    return await this.getTimeSeries(symbol, config.interval, config.outputsize);
  }

  /**
   * Get cache and API usage statistics
   * @returns {Object} Usage statistics
   */
  getUsageStats() {
    const cacheSize = this.cache.size;
    const cacheEntries = Array.from(this.cache.keys());
    
    return {
      dailyRequestsUsed: this.dailyRequests,
      dailyRequestsRemaining: this.maxDailyRequests - this.dailyRequests,
      cacheEntries: cacheSize,
      cachedSymbols: cacheEntries,
      cacheExpiryMinutes: this.cacheExpiry / (60 * 1000)
    };
  }

  /**
   * Clear cache (useful for testing or manual refresh)
   */
  clearCache() {
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  /**
   * Preload data for common timeframes to optimize user experience
   * @param {string} symbol - Stock symbol to preload
   */
  async preloadCommonTimeframes(symbol) {
    const commonTimeframes = ['1M', '3M', '1Y']; // Most used timeframes
    const preloadPromises = [];

    console.log(`🚀 Preloading common timeframes for ${symbol}...`);

    for (const timeframe of commonTimeframes) {
      const config = this.getTimeframeConfig(timeframe);
      const cacheKey = `${symbol}_${config.interval}_${config.outputsize}`;
      
      // Only preload if not already cached
      if (!this.getCachedData(cacheKey)) {
        preloadPromises.push(
          this.getHistoricalData(symbol, timeframe).catch(error => {
            console.warn(`Failed to preload ${symbol} ${timeframe}:`, error.message);
          })
        );
      }
    }

    if (preloadPromises.length > 0) {
      await Promise.all(preloadPromises);
      console.log(`✅ Preloaded ${preloadPromises.length} timeframes for ${symbol}`);
    } else {
      console.log(`🎯 All common timeframes already cached for ${symbol}`);
    }
  }

  /**
   * Health check for Twelve Data service
   */
  async healthCheck() {
    try {
      const stats = this.getUsageStats();
      console.log('📊 Twelve Data Usage Stats:', stats);

      const response = await this.getQuote('AAPL');
      
      if (response && response.currentPrice > 0) {
        return { 
          status: 'healthy', 
          service: 'Twelve Data',
          usage: stats
        };
      } else {
        return { status: 'error', message: 'Invalid response', service: 'Twelve Data' };
      }
    } catch (error) {
      if (error.message.includes('429')) {
        return { status: 'rate_limited', message: 'Rate limit exceeded', service: 'Twelve Data' };
      }
      return { status: 'error', message: error.message, service: 'Twelve Data' };
    }
  }
}

export default new TwelveDataService();