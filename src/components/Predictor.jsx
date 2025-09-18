import React, { useState, useEffect } from 'react';
import StockSearch from './StockSearch';
import TradingChart from './TradingChart';
import StockDetails from './StockDetails';
import './Predictor.css';

const Predictor = ({ initialSymbol = 'AAPL' }) => {
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [selectedCompany, setSelectedCompany] = useState('Apple Inc.');
  const [timeframe, setTimeframe] = useState('1M');

  // Update selected symbol when initialSymbol changes
  useEffect(() => {
    if (initialSymbol && initialSymbol !== selectedSymbol) {
      setSelectedSymbol(initialSymbol);
      setSelectedCompany(`${initialSymbol} Inc.`); // Generic company name
    }
  }, [initialSymbol]);

  const handleSymbolSelect = (symbol, name) => {
    setSelectedSymbol(symbol);
    setSelectedCompany(name);
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
  };

  return (
    <div className="predictor">
      <div className="predictor-header">
        <h2>Stock Analysis & Prediction</h2>
        <p>Advanced AI-powered stock analysis with real-time data</p>
      </div>

      <div className="search-section">
        <StockSearch 
          onSymbolSelect={handleSymbolSelect}
          placeholder="Search stocks (e.g., AAPL, TSLA, MSFT)..."
        />
      </div>

      {selectedSymbol && (
        <div className="analysis-container">
          <div className="chart-section">
            <div className="chart-header">
              <h3>{selectedSymbol} - {selectedCompany}</h3>
              <div className="timeframe-selector">
                {['1D', '5D', '1M', '3M', '6M', '1Y', '2Y', '5Y'].map(tf => (
                  <button
                    key={tf}
                    className={`timeframe-btn ${timeframe === tf ? 'active' : ''}`}
                    onClick={() => handleTimeframeChange(tf)}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
            <TradingChart 
              symbol={selectedSymbol} 
              timeframe={timeframe}
              height={500}
            />
          </div>

          <div className="details-section">
            <StockDetails symbol={selectedSymbol} />
          </div>
        </div>
      )}

      <div className="features-grid">
        <div className="feature-card">
          <h4>📈 Real-time Data</h4>
          <p>Live stock quotes, charts, and market data from Yahoo Finance and Polygon.io</p>
        </div>
        <div className="feature-card">
          <h4>🤖 AI Analysis</h4>
          <p>Advanced market analysis using Google Gemini and Hugging Face AI models</p>
        </div>
        <div className="feature-card">
          <h4>📊 Technical Indicators</h4>
          <p>RSI, MACD, Moving Averages, Bollinger Bands, and more technical analysis tools</p>
        </div>
        <div className="feature-card">
          <h4>📰 News Sentiment</h4>
          <p>Real-time news analysis with AI-powered sentiment scoring</p>
        </div>
        <div className="feature-card">
          <h4>💹 Professional Charts</h4>
          <p>TradingView-powered interactive charts with multiple timeframes</p>
        </div>
        <div className="feature-card">
          <h4>🔍 Smart Search</h4>
          <p>Intelligent stock search across major exchanges with real-time suggestions</p>
        </div>
      </div>
    </div>
  );
};

export default Predictor;
