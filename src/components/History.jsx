import React, { useState, useEffect } from 'react';
import './History.css';

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('History component mounted');
    loadPredictionHistory();
  }, []);

  const loadPredictionHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate loading prediction history with realistic data
      setTimeout(() => {
        setPredictions([
          {
            id: 1,
            symbol: 'AAPL',
            prediction: 'BUY',
            confidence: 85,
            price: 175.50,
            targetPrice: 190.00,
            date: '2025-09-15',
            status: 'active',
            currentPrice: 178.20,
            change: 2.70,
            changePercent: 1.54
          },
          {
            id: 2,
            symbol: 'TSLA',
            prediction: 'HOLD',
            confidence: 72,
            price: 250.30,
            targetPrice: 260.00,
            date: '2025-09-10',
            status: 'completed',
            currentPrice: 255.80,
            change: 5.50,
            changePercent: 2.20
          },
          {
            id: 3,
            symbol: 'MSFT',
            prediction: 'BUY',
            confidence: 91,
            price: 420.80,
            targetPrice: 450.00,
            date: '2025-09-08',
            status: 'active',
            currentPrice: 425.60,
            change: 4.80,
            changePercent: 1.14
          },
          {
            id: 4,
            symbol: 'NVDA',
            prediction: 'STRONG_BUY',
            confidence: 88,
            price: 168.50,
            targetPrice: 195.00,
            date: '2025-09-12',
            status: 'active',
            currentPrice: 176.00,
            change: 7.50,
            changePercent: 4.45
          },
          {
            id: 5,
            symbol: 'GOOGL',
            prediction: 'SELL',
            confidence: 76,
            price: 142.30,
            targetPrice: 130.00,
            date: '2025-09-05',
            status: 'expired',
            currentPrice: 138.90,
            change: -3.40,
            changePercent: -2.39
          }
        ]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      console.error('Error loading prediction history:', err);
      setError('Failed to load prediction history');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return '#0066cc';
      case 'completed': return '#26a69a';
      case 'expired': return '#ff6b6b';
      default: return '#999';
    }
  };

  const getPredictionColor = (prediction) => {
    switch(prediction) {
      case 'STRONG_BUY': return '#4caf50';
      case 'BUY': return '#26a69a';
      case 'SELL': return '#ef5350';
      case 'STRONG_SELL': return '#d32f2f';
      case 'HOLD': return '#ffa726';
      default: return '#999';
    }
  };

  const calculatePerformance = (prediction) => {
    const expectedChange = ((prediction.targetPrice - prediction.price) / prediction.price) * 100;
    const actualChange = prediction.changePercent;
    
    if (prediction.prediction === 'BUY' || prediction.prediction === 'STRONG_BUY') {
      return actualChange > 0 ? 'positive' : 'negative';
    } else if (prediction.prediction === 'SELL' || prediction.prediction === 'STRONG_SELL') {
      return actualChange < 0 ? 'positive' : 'negative';
    } else {
      return Math.abs(actualChange) < 2 ? 'positive' : 'negative';
    }
  };

  if (loading) {
    return (
      <div className="history">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading prediction history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history">
        <div className="error-container">
          <h3>Error Loading History</h3>
          <p>{error}</p>
          <button onClick={loadPredictionHistory} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const activePredictions = predictions.filter(p => p.status === 'active');
  const completedPredictions = predictions.filter(p => p.status === 'completed');
  const successfulPredictions = predictions.filter(p => calculatePerformance(p) === 'positive');
  const avgConfidence = predictions.length > 0 ? 
    Math.round(predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length) : 0;

  return (
    <div className="history">
      <div className="history-header">
        <h2>📈 Prediction History</h2>
        <p>Track your AI-powered stock predictions and their performance</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Predictions</h3>
          <span className="stat-value">{predictions.length}</span>
          <span className="stat-label">All time</span>
        </div>
        <div className="stat-card">
          <h3>Active Predictions</h3>
          <span className="stat-value">{activePredictions.length}</span>
          <span className="stat-label">Currently tracking</span>
        </div>
        <div className="stat-card">
          <h3>Success Rate</h3>
          <span className="stat-value">
            {completedPredictions.length > 0 ? 
              Math.round((successfulPredictions.length / completedPredictions.length) * 100) : 0}%
          </span>
          <span className="stat-label">Completed predictions</span>
        </div>
        <div className="stat-card">
          <h3>Avg Confidence</h3>
          <span className="stat-value">{avgConfidence}%</span>
          <span className="stat-label">Model certainty</span>
        </div>
      </div>

      <div className="predictions-list">
        {predictions.map(prediction => (
          <div key={prediction.id} className="prediction-card">
            <div className="prediction-header">
              <div className="stock-info">
                <h3 className="symbol">{prediction.symbol}</h3>
                <span 
                  className="prediction-type"
                  style={{ color: getPredictionColor(prediction.prediction) }}
                >
                  {prediction.prediction.replace('_', ' ')}
                </span>
              </div>
              <div className="prediction-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(prediction.status) }}
                >
                  {prediction.status.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="prediction-details">
              <div className="detail-item">
                <label>Entry Price</label>
                <span>${prediction.price.toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <label>Target Price</label>
                <span>${prediction.targetPrice.toFixed(2)}</span>
              </div>
              <div className="detail-item">
                <label>Current Price</label>
                <span style={{ color: prediction.change >= 0 ? '#26a69a' : '#ef5350' }}>
                  ${prediction.currentPrice.toFixed(2)}
                </span>
              </div>
              <div className="detail-item">
                <label>Performance</label>
                <span style={{ color: prediction.change >= 0 ? '#26a69a' : '#ef5350' }}>
                  {prediction.change >= 0 ? '+' : ''}{prediction.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            <div className="prediction-progress">
              <div className="confidence-bar">
                <label>Confidence: {prediction.confidence}%</label>
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${prediction.confidence}%`,
                      backgroundColor: prediction.confidence > 80 ? '#26a69a' : 
                                       prediction.confidence > 60 ? '#ffa726' : '#ef5350'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="prediction-meta">
              <span className="date">Created: {new Date(prediction.date).toLocaleDateString()}</span>
              <span className={`performance-indicator ${calculatePerformance(prediction)}`}>
                {calculatePerformance(prediction) === 'positive' ? '✅ On Track' : '❌ Off Track'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {predictions.length === 0 && (
        <div className="empty-state">
          <h3>No predictions yet</h3>
          <p>Your stock predictions will appear here once you start analyzing stocks in the Predictor tab.</p>
        </div>
      )}
    </div>
  );
}