import { useEffect, useRef, useState } from 'react';
import { createChart, ColorType } from 'lightweight-charts';
import yahooFinanceService from '../services/stock/yahooFinanceService';
import polygonService from '../services/stock/polygonService';
import alphaVantageService from '../services/stock/alphaVantageService';
import './TradingChart.css';

const TradingChart = ({ symbol = 'AAPL', timeframe = '1D', height = 400 }) => {
  const chartContainerRef = useRef();
  const chart = useRef();
  const candlestickSeries = useRef();
  const volumeSeries = useRef();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [indicators, setIndicators] = useState({
    rsi: false,
    macd: false,
    sma20: false,
    sma50: false,
    bollinger: false
  });

  useEffect(() => {
    if (!chartContainerRef.current) return;

    // Create chart
    chart.current = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#0a0a0a' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      crosshair: {
        mode: 0,
      },
      rightPriceScale: {
        borderColor: '#2B2B43',
      },
      timeScale: {
        borderColor: '#2B2B43',
        timeVisible: true,
        secondsVisible: false,
      },
      width: chartContainerRef.current.clientWidth,
      height: height,
    });

    // Add candlestick series
    candlestickSeries.current = chart.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Add volume series
    volumeSeries.current = chart.current.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    // Handle resize
    const resizeObserver = new ResizeObserver(() => {
      if (chart.current && chartContainerRef.current) {
        chart.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    });

    resizeObserver.observe(chartContainerRef.current);

    return () => {
      if (chart.current) {
        chart.current.remove();
      }
      resizeObserver.disconnect();
    };
  }, [height]);

  useEffect(() => {
    if (symbol && chart.current) {
      loadChartData();
    }
  }, [symbol, timeframe]);

  const loadChartData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Calculate date range based on timeframe
      const { period, interval } = getTimeframeParams(timeframe);
      
      // Try Yahoo Finance first, fallback to Polygon
      let chartData;
      try {
        const data = await yahooFinanceService.getHistoricalData(symbol, period, interval);
        chartData = formatYahooData(data);
      } catch (yahooError) {
        console.warn('Yahoo Finance failed, trying Polygon:', yahooError);
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - getDateOffset(timeframe)).toISOString().split('T')[0];
        const data = await polygonService.getAggregates(symbol, 1, 'day', startDate, endDate);
        chartData = formatPolygonData(data);
      }

      if (chartData && chartData.length > 0) {
        // Set candlestick data
        candlestickSeries.current.setData(chartData.map(item => ({
          time: item.time,
          open: item.open,
          high: item.high,
          low: item.low,
          close: item.close,
        })));

        // Set volume data
        volumeSeries.current.setData(chartData.map(item => ({
          time: item.time,
          value: item.volume,
          color: item.close >= item.open ? '#26a69a40' : '#ef535040',
        })));

        // Fit content
        chart.current.timeScale().fitContent();
      }
    } catch (error) {
      console.error('Chart data loading error:', error);
      setError('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  };

  const addIndicator = async (indicatorType) => {
    if (!symbol) return;

    try {
      setLoading(true);
      
      switch (indicatorType) {
        case 'rsi':
          await addRSI();
          break;
        case 'macd':
          await addMACD();
          break;
        case 'sma20':
          await addSMA(20);
          break;
        case 'sma50':
          await addSMA(50);
          break;
        case 'bollinger':
          await addBollingerBands();
          break;
      }

      setIndicators(prev => ({ ...prev, [indicatorType]: true }));
    } catch (error) {
      console.error(`Error adding ${indicatorType}:`, error);
      setError(`Failed to add ${indicatorType.toUpperCase()}`);
    } finally {
      setLoading(false);
    }
  };

  const addRSI = async () => {
    const data = await alphaVantageService.getRSI(symbol, '1day', 14);
    if (data.values) {
      const rsiSeries = chart.current.addLineSeries({
        color: '#f48fb1',
        lineWidth: 2,
        priceScaleId: 'rsi',
      });

      chart.current.priceScale('rsi').applyOptions({
        scaleMargins: { top: 0.1, bottom: 0.8 },
        borderVisible: false,
      });

      const rsiData = data.values.map(item => ({
        time: item.datetime,
        value: parseFloat(item.rsi)
      }));

      rsiSeries.setData(rsiData);
    }
  };

  const addMACD = async () => {
    const data = await alphaVantageService.getMACD(symbol, '1day');
    if (data.values) {
      const macdSeries = chart.current.addLineSeries({
        color: '#2196f3',
        lineWidth: 2,
        priceScaleId: 'macd',
      });

      const signalSeries = chart.current.addLineSeries({
        color: '#ff9800',
        lineWidth: 2,
        priceScaleId: 'macd',
      });

      chart.current.priceScale('macd').applyOptions({
        scaleMargins: { top: 0.7, bottom: 0.1 },
        borderVisible: false,
      });

      const macdData = data.values.map(item => ({
        time: item.datetime,
        value: parseFloat(item.macd)
      }));

      const signalData = data.values.map(item => ({
        time: item.datetime,
        value: parseFloat(item.macd_signal)
      }));

      macdSeries.setData(macdData);
      signalSeries.setData(signalData);
    }
  };

  const addSMA = async (period) => {
    const data = await alphaVantageService.getSMA(symbol, '1day', period);
    if (data.values) {
      const smaSeries = chart.current.addLineSeries({
        color: period === 20 ? '#4caf50' : '#ff5722',
        lineWidth: 2,
      });

      const smaData = data.values.map(item => ({
        time: item.datetime,
        value: parseFloat(item.sma)
      }));

      smaSeries.setData(smaData);
    }
  };

  const addBollingerBands = async () => {
    const data = await alphaVantageService.getBollingerBands(symbol, '1day', 20);
    if (data.values) {
      const upperSeries = chart.current.addLineSeries({
        color: '#9c27b0',
        lineWidth: 1,
        lineStyle: 2, // Dashed
      });

      const middleSeries = chart.current.addLineSeries({
        color: '#9c27b0',
        lineWidth: 2,
      });

      const lowerSeries = chart.current.addLineSeries({
        color: '#9c27b0',
        lineWidth: 1,
        lineStyle: 2, // Dashed
      });

      const upperData = data.values.map(item => ({
        time: item.datetime,
        value: parseFloat(item.real_upper_band)
      }));

      const middleData = data.values.map(item => ({
        time: item.datetime,
        value: parseFloat(item.real_middle_band)
      }));

      const lowerData = data.values.map(item => ({
        time: item.datetime,
        value: parseFloat(item.real_lower_band)
      }));

      upperSeries.setData(upperData);
      middleSeries.setData(middleData);
      lowerSeries.setData(lowerData);
    }
  };

  const removeIndicator = (indicatorType) => {
    // This would require tracking series references to remove them
    // For now, we'll just reload the chart
    setIndicators(prev => ({ ...prev, [indicatorType]: false }));
    loadChartData();
  };

  // Helper functions
  const getTimeframeParams = (timeframe) => {
    const timeframes = {
      '1D': { period: '1d', interval: '5m' },
      '5D': { period: '5d', interval: '15m' },
      '1M': { period: '1mo', interval: '1d' },
      '3M': { period: '3mo', interval: '1d' },
      '6M': { period: '6mo', interval: '1d' },
      '1Y': { period: '1y', interval: '1d' },
      '2Y': { period: '2y', interval: '1wk' },
      '5Y': { period: '5y', interval: '1mo' },
    };
    return timeframes[timeframe] || timeframes['1M'];
  };

  const getDateOffset = (timeframe) => {
    const offsets = {
      '1D': 24 * 60 * 60 * 1000, // 1 day
      '5D': 5 * 24 * 60 * 60 * 1000, // 5 days
      '1M': 30 * 24 * 60 * 60 * 1000, // 30 days
      '3M': 90 * 24 * 60 * 60 * 1000, // 90 days
      '6M': 180 * 24 * 60 * 60 * 1000, // 180 days
      '1Y': 365 * 24 * 60 * 60 * 1000, // 365 days
      '2Y': 2 * 365 * 24 * 60 * 60 * 1000, // 2 years
      '5Y': 5 * 365 * 24 * 60 * 60 * 1000, // 5 years
    };
    return offsets[timeframe] || offsets['1M'];
  };

  const formatYahooData = (data) => {
    if (!data.chart?.[0]?.result?.[0]) return [];
    
    const result = data.chart[0].result[0];
    const timestamps = result.timestamp;
    const ohlc = result.indicators.quote[0];
    const volumes = result.indicators.quote[0].volume;

    return timestamps.map((timestamp, index) => ({
      time: timestamp,
      open: ohlc.open[index] || 0,
      high: ohlc.high[index] || 0,
      low: ohlc.low[index] || 0,
      close: ohlc.close[index] || 0,
      volume: volumes[index] || 0,
    })).filter(item => item.open && item.high && item.low && item.close);
  };

  const formatPolygonData = (data) => {
    return data.candles || [];
  };

  return (
    <div className="trading-chart">
      <div className="chart-controls">
        <div className="timeframe-buttons">
          {['1D', '5D', '1M', '3M', '6M', '1Y', '2Y', '5Y'].map(tf => (
            <button
              key={tf}
              className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
              onClick={() => loadChartData()}
            >
              {tf}
            </button>
          ))}
        </div>
        
        <div className="indicator-buttons">
          <button
            className={`indicator-btn ${indicators.rsi ? 'active' : ''}`}
            onClick={() => indicators.rsi ? removeIndicator('rsi') : addIndicator('rsi')}
          >
            RSI
          </button>
          <button
            className={`indicator-btn ${indicators.macd ? 'active' : ''}`}
            onClick={() => indicators.macd ? removeIndicator('macd') : addIndicator('macd')}
          >
            MACD
          </button>
          <button
            className={`indicator-btn ${indicators.sma20 ? 'active' : ''}`}
            onClick={() => indicators.sma20 ? removeIndicator('sma20') : addIndicator('sma20')}
          >
            SMA 20
          </button>
          <button
            className={`indicator-btn ${indicators.sma50 ? 'active' : ''}`}
            onClick={() => indicators.sma50 ? removeIndicator('sma50') : addIndicator('sma50')}
          >
            SMA 50
          </button>
          <button
            className={`indicator-btn ${indicators.bollinger ? 'active' : ''}`}
            onClick={() => indicators.bollinger ? removeIndicator('bollinger') : addIndicator('bollinger')}
          >
            Bollinger
          </button>
        </div>
      </div>

      {loading && <div className="chart-loading">Loading chart data...</div>}
      {error && <div className="chart-error">Error: {error}</div>}
      
      <div ref={chartContainerRef} className="chart-container" />
    </div>
  );
};

export default TradingChart;