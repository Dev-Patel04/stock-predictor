import React, { useState, useEffect } from 'react';
import finnhubService from '../services/stock/finnhubService';
import twelveDataService from '../services/chart/twelveDataService';
import RechartsStockChart from './RechartsStockChart';
import './StockViewer.css';

const StockViewer = ({ initialSymbol, onBack }) => {
  const [symbol, setSymbol] = useState(initialSymbol?.toUpperCase() || 'AAPL');
  const [stockData, setStockData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [timeframe, setTimeframe] = useState('1D');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  // Debug log
  console.log('StockViewer initialized with:', { initialSymbol, symbol });

  // Test the API keys on component mount
  useEffect(() => {
    console.log('Testing API access...');
    console.log('Finnhub API key:', import.meta.env.VITE_FINNHUB_KEY ? 'Present' : 'Missing');
    console.log('Twelve Data API key:', import.meta.env.VITE_TWELVE_DATA_KEY ? 'Present' : 'Missing');
  }, []);

  const timeframes = [
    { label: '1D', value: '1D', resolution: '5', days: 1 },
    { label: '5D', value: '5D', resolution: '30', days: 5 },
    { label: '1M', value: '1M', resolution: '60', days: 30 },
    { label: '3M', value: '3M', resolution: 'D', days: 90 },
    { label: '6M', value: '6M', resolution: 'D', days: 180 },
    { label: '1Y', value: '1Y', resolution: 'D', days: 365 }
  ];

  useEffect(() => {
    if (symbol) {
      loadStockData();
    }
  }, [symbol, timeframe]);



  const loadStockData = async () => {
    setLoading(true);
    setError(null);

    try {
      console.log(`📊 Loading ${symbol} data for ${timeframe}...`);

      // Get current quote from Finnhub (real-time, working well)
      console.log('Fetching real-time quote from Finnhub...');
      const quote = await finnhubService.getQuote(symbol);
      if (!quote || quote.currentPrice <= 0) {
        throw new Error(`No data available for ${symbol}. Please check the symbol and try again.`);
      }

      setStockData(quote);
      console.log(`✅ Got real-time quote: ${symbol} at $${quote.currentPrice}`);

      // Show API usage statistics
      const usageStats = twelveDataService.getUsageStats();
      console.log('📊 Twelve Data Usage:', usageStats);

      // Get historical chart data from Twelve Data
      console.log(`Fetching ${timeframe} chart data from Twelve Data...`);
      try {
        const chartData = await twelveDataService.getHistoricalData(symbol, timeframe);
        
        if (chartData && chartData.length > 0) {
          setChartData(chartData);
          console.log(`✅ Loaded ${chartData.length} chart data points for ${symbol}`);
          
          console.log('📊 Chart data loaded successfully');
          console.log('📊 Chart data format (first 3 items):', chartData.slice(0, 3));
          console.log('📊 Chart data length:', chartData.length);
          
          // Clear any previous errors
          setError(null);

          // Preload other common timeframes in the background (don't await)
          if (timeframe === '1M') { // Only preload when loading default timeframe
            twelveDataService.preloadCommonTimeframes(symbol).catch(error => {
              console.log('Background preload failed:', error.message);
            });
          }
        } else {
          throw new Error('No chart data received from Twelve Data');
        }
      } catch (chartError) {
        console.warn(`Twelve Data chart failed for ${symbol}:`, chartError.message);
        
        // Fallback: Create single data point from Finnhub quote
        const fallbackData = [{
          time: new Date().toISOString().split('T')[0], // Today's date in YYYY-MM-DD format
          open: quote.open,
          high: quote.high,
          low: quote.low,
          close: quote.currentPrice,
          volume: 0
        }];
        
        setChartData(fallbackData);
        console.log('📈 Using fallback single-point data for chart');
        
        // Show warning but don't fail completely
        const isRateLimit = chartError.message.includes('429') || chartError.message.includes('rate limit');
        const errorMsg = isRateLimit 
          ? `Chart data temporarily unavailable (rate limit). Showing current price.`
          : `Historical chart data unavailable. Showing current price only.`;
        
        setError(errorMsg);
      }

    } catch (error) {
      console.error('Stock data loading error:', error);
      
      // Provide specific error messages
      let errorMessage = `Failed to load data for ${symbol}`;
      
      if (error.message && error.message.includes('HTTP 403')) {
        errorMessage = `Access denied. Please check the stock symbol or try again later.`;
      } else if (error.message && error.message.includes('HTTP 429')) {
        errorMessage = `Rate limit exceeded. Please wait a moment and try again.`;
      } else if (error.message && error.message.includes('HTTP 404')) {
        errorMessage = `Stock symbol "${symbol}" not found. Please check the symbol.`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      setStockData(null);
      setChartData([]);
      
      // Clear chart
      if (candlestickSeriesRef.current) {
        candlestickSeriesRef.current.setData([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchSymbol = searchInput.trim().toUpperCase();
    if (searchSymbol && searchSymbol !== symbol) {
      setSymbol(searchSymbol);
      setSearchInput('');
    }
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatPercent = (value) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value) => {
    return value >= 0 ? '#26a69a' : '#ef5350';
  };

  // TradingView charts handle all visualization now

  return (
    <div className="stock-viewer">
      {/* Header */}
      <div className="viewer-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            ← Back to Dashboard
          </button>
          <h2>Stock Viewer</h2>
        </div>
        
        {/* Search Bar */}
        <form className="search-form" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter stock symbol (e.g., AAPL)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value.toUpperCase())}
            className="search-input"
          />
          <button type="submit" className="search-button">
            🔍 Search
          </button>
        </form>
      </div>

      {/* Stock Info */}
      {stockData && (
        <div className="stock-info">
          <div className="stock-title">
            <h1>{symbol}</h1>
            <span className="data-source">Finnhub</span>
          </div>
          <div className="stock-price">
            <span className="price">{formatPrice(stockData.currentPrice)}</span>
            <span 
              className="change" 
              style={{ color: getChangeColor(stockData.changePercent) }}
            >
              {formatPrice(stockData.change)} ({formatPercent(stockData.changePercent)})
            </span>
          </div>
          <div className="stock-details">
            <span>Open: {formatPrice(stockData.open)}</span>
            <span>High: {formatPrice(stockData.high)}</span>
            <span>Low: {formatPrice(stockData.low)}</span>
            <span>Prev Close: {formatPrice(stockData.previousClose)}</span>
          </div>
        </div>
      )}

      {/* Timeframe Selector */}
      <div className="timeframe-selector">
        {timeframes.map(tf => (
          <button
            key={tf.value}
            className={`timeframe-button ${timeframe === tf.value ? 'active' : ''}`}
            onClick={() => handleTimeframeChange(tf.value)}
            disabled={loading}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* TradingView Professional Chart Area */}
      <div className="chart-container">
        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner">📊</div>
            <div>Loading professional chart data...</div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <div className="error-icon">⚠️</div>
            <div className="error-text">
              <h3>Chart Data Notice</h3>
              <p>{error}</p>
              <button onClick={loadStockData} className="retry-button">
                🔄 Try Again
              </button>
            </div>
          </div>
        )}

        {/* Recharts Professional Chart */}
        <RechartsStockChart 
          data={chartData}
          symbol={symbol}
          timeframe={timeframe}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default StockViewer;