import React, { useState, useEffect } from 'react';
import './TradingDashboard.css';

export default function TradingDashboard({ model, config, onBack }) {
  // Add safety checks for props
  if (!model || !config) {
    console.error('TradingDashboard: Missing required props', { model, config });
    return (
      <div className="trading-dashboard">
        <div className="error-state">
          <h2>Error Loading Dashboard</h2>
          <p>Missing required configuration data.</p>
          <button onClick={onBack}>← Back to Configuration</button>
        </div>
      </div>
    );
  }

  const [portfolioData, setPortfolioData] = useState({
    balance: config.paperTradingBalance || 100000,
    totalPnL: 0,
    dayPnL: 0,
    totalTrades: 0,
    winRate: 0,
    activePositions: []
  });

  const [recentSignals, setRecentSignals] = useState([]);
  const [isLive, setIsLive] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Simulate live trading data
  useEffect(() => {
    if (!isLive) return; // Don't run if paused
    
    const interval = setInterval(() => {
      setCurrentTime(new Date());
      
      // Simulate random signals
      if (Math.random() < 0.1) { // 10% chance per interval
        generateRandomSignal();
      }
      
      // Update portfolio randomly
      if (Math.random() < 0.3) { // 30% chance per interval
        updatePortfolioData();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]); // Simplified dependencies - remove function deps that might cause loops

  const generateRandomSignal = () => {
    const symbols = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'META', 'AMZN'];
    const signalTypes = ['BUY', 'SELL', 'ALERT'];
    const confidences = [72, 78, 83, 87, 91, 94];
    
    // Safety check for model.widgets
    const widgets = model?.widgets || [];
    if (widgets.length === 0) {
      console.warn('No widgets available for signal generation');
      return;
    }
    
    const signal = {
      id: Date.now(),
      symbol: symbols[Math.floor(Math.random() * symbols.length)],
      type: signalTypes[Math.floor(Math.random() * signalTypes.length)],
      price: (150 + Math.random() * 200).toFixed(2),
      confidence: confidences[Math.floor(Math.random() * confidences.length)],
      strategy: widgets[Math.floor(Math.random() * widgets.length)].name,
      timestamp: new Date()
    };

    setRecentSignals(prev => [signal, ...prev.slice(0, 9)]); // Keep last 10
  };

  const updatePortfolioData = () => {
    setPortfolioData(prev => {
      const change = (Math.random() - 0.5) * 200; // Random change
      return {
        ...prev,
        totalPnL: prev.totalPnL + change,
        dayPnL: prev.dayPnL + change,
        totalTrades: prev.totalTrades + (Math.random() < 0.3 ? 1 : 0)
      };
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const formatPercent = (value, total) => {
    return ((value / total) * 100).toFixed(2);
  };

  const getSignalColor = (type) => {
    switch (type) {
      case 'BUY': return '#4CAF50';
      case 'SELL': return '#f44336';
      case 'ALERT': return '#FF9800';
      default: return '#4A9EFF';
    }
  };

  return (
    <div className="trading-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            ← Back
          </button>
          <div className="model-info">
            <h2>"{model.name}" - Live Trading</h2>
            <span className="live-status">
              {isLive ? '🟢' : '🔴'} {isLive ? 'LIVE' : 'PAUSED'} • 
              Paper Trading • {currentTime.toLocaleTimeString()}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button 
            className={`live-toggle ${isLive ? 'active' : ''}`}
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? '⏸️ Pause' : '▶️ Resume'}
          </button>
          <button 
            className="save-model-btn"
            onClick={() => {
              // TODO: Implement backend save functionality
              console.log('Save model clicked - will connect to backend');
              alert('Save functionality will be implemented with backend integration');
            }}
          >
            💾 Save Model
          </button>
          <button className="settings-btn">⚙️ Settings</button>
        </div>
      </div>

      {/* Main Dashboard */}
      <div className="dashboard-content">
        {/* Portfolio Overview */}
        <div className="portfolio-section">
          <h3>📊 Portfolio Overview</h3>
          <div className="portfolio-cards">
            <div className="portfolio-card balance">
              <div className="card-header">
                <span className="card-title">Total Balance</span>
                <span className="card-icon">💰</span>
              </div>
              <div className="card-value">
                {formatCurrency(portfolioData.balance + portfolioData.totalPnL)}
              </div>
              <div className="card-change">
                {formatCurrency(portfolioData.totalPnL)} 
                ({formatPercent(portfolioData.totalPnL, portfolioData.balance)}%)
              </div>
            </div>

            <div className="portfolio-card pnl">
              <div className="card-header">
                <span className="card-title">Day P&L</span>
                <span className="card-icon">📈</span>
              </div>
              <div className={`card-value ${portfolioData.dayPnL >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(portfolioData.dayPnL)}
              </div>
              <div className="card-change">
                {formatPercent(portfolioData.dayPnL, portfolioData.balance)}%
              </div>
            </div>

            <div className="portfolio-card trades">
              <div className="card-header">
                <span className="card-title">Total Trades</span>
                <span className="card-icon">🔄</span>
              </div>
              <div className="card-value">
                {portfolioData.totalTrades}
              </div>
              <div className="card-change">
                Win Rate: {portfolioData.totalTrades > 0 ? 67 : 0}%
              </div>
            </div>

            <div className="portfolio-card risk">
              <div className="card-header">
                <span className="card-title">Risk Level</span>
                <span className="card-icon">⚠️</span>
              </div>
              <div className="card-value risk-level">
                LOW
              </div>
              <div className="card-change">
                {config.riskPerTrade}% per trade
              </div>
            </div>
          </div>
        </div>

        {/* Active Model Widgets */}
        <div className="widgets-section">
          <h3>🎛️ Active Model Widgets</h3>
          <div className="widget-status-grid">
            {(model?.widgets || []).map((widget, index) => (
              <div key={index} className="widget-status-card">
                <div className="widget-status-header">
                  <span className="widget-icon">{widget.icon}</span>
                  <div className="widget-info">
                    <span className="widget-name">{widget.name}</span>
                    <span className="widget-desc">{widget.description}</span>
                  </div>
                  <div className="widget-status-indicator">
                    <div className="status-dot pending"></div>
                    <span>{isLive ? 'API Not Connected' : 'Paused'}</span>
                  </div>
                </div>
                <div className="widget-metrics">
                  <div className="metric">
                    <span className="metric-label">Signals Today</span>
                    <span className="metric-value">{isLive ? Math.floor(Math.random() * 8) + 1 : 0}</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Accuracy</span>
                    <span className="metric-value">{Math.floor(Math.random() * 20) + 60}%</span>
                  </div>
                  <div className="metric">
                    <span className="metric-label">Last Signal</span>
                    <span className="metric-value">{isLive ? `${Math.floor(Math.random() * 30) + 1}m ago` : 'Paused'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Signals */}
        <div className="signals-section">
          <div className="section-header">
            <h3>⚡ Live Signals</h3>
            <span className="signal-count">{isLive ? recentSignals.length : 0} recent</span>
          </div>
          <div className="signals-list">
            {!isLive || recentSignals.length === 0 ? (
              <div className="no-signals">
                <span className="no-signals-icon">📡</span>
                <p>{isLive ? 'Monitoring market for signals...' : 'Trading is paused'}</p>
                <small>{isLive ? 'Your model will generate alerts when conditions are met' : 'Resume trading to see live signals'}</small>
              </div>
            ) : (
              recentSignals.map(signal => (
                <div key={signal.id} className="signal-item">
                  <div className="signal-main">
                    <div className="signal-symbol">{signal.symbol}</div>
                    <div 
                      className="signal-type"
                      style={{ color: getSignalColor(signal.type) }}
                    >
                      {signal.type}
                    </div>
                    <div className="signal-price">${signal.price}</div>
                    <div className="signal-confidence">
                      <div className="confidence-bar">
                        <div 
                          className="confidence-fill"
                          style={{ width: `${signal.confidence}%` }}
                        ></div>
                      </div>
                      <span>{signal.confidence}%</span>
                    </div>
                  </div>
                  <div className="signal-details">
                    <span className="signal-strategy">via {signal.strategy}</span>
                    <span className="signal-time">
                      {signal.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="signal-actions">
                    <button className="execute-btn">Execute</button>
                    <button className="dismiss-btn">Dismiss</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="chart-section">
          <h3>📈 Performance Chart</h3>
          <div className="chart-placeholder">
            <div className="chart-content">
              <div className="chart-line">
                <div className="chart-point" style={{ left: '10%', bottom: '40%' }}></div>
                <div className="chart-point" style={{ left: '25%', bottom: '55%' }}></div>
                <div className="chart-point" style={{ left: '40%', bottom: '45%' }}></div>
                <div className="chart-point" style={{ left: '55%', bottom: '70%' }}></div>
                <div className="chart-point" style={{ left: '70%', bottom: '60%' }}></div>
                <div className="chart-point" style={{ left: '85%', bottom: '75%' }}></div>
              </div>
              <div className="chart-info">
                <p>📊 Real-time performance tracking</p>
                <small>Chart will show live P&L, drawdown, and signal performance</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}