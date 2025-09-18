import React, { useState, useEffect } from 'react';
import './History.css';

export default function History() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading prediction history
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
          status: 'active'
        },
        {
          id: 2,
          symbol: 'TSLA',
          prediction: 'HOLD',
          confidence: 72,
          price: 250.30,
          targetPrice: 260.00,
          date: '2025-09-10',
          status: 'completed'
        },
        {
          id: 3,
          symbol: 'MSFT',
          prediction: 'BUY',
          confidence: 91,
          price: 420.80,
          targetPrice: 450.00,
          date: '2025-09-08',
          status: 'active'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    return status === 'active' ? '#26a69a' : '#888';
  };

  const getPredictionColor = (prediction) => {
    switch (prediction) {
      case 'BUY': return '#26a69a';
      case 'SELL': return '#ef5350';
      case 'HOLD': return '#ff9800';
      default: return '#888';
    }
  };

  if (loading) {
    return (
      <div className="history">
        <div className="loading">Loading prediction history...</div>
      </div>
    );
  }

  return (
    <div className="history">
      <div className="history-header">
        <h2>Prediction History</h2>
        <p>Track your stock predictions and their performance</p>
      </div>

      <div className="predictions-list">
        {predictions.map(prediction => (
          <div key={prediction.id} className="prediction-card">
            <div className="prediction-main">
              <div className="prediction-symbol">{prediction.symbol}</div>
              <div 
                className="prediction-action"
                style={{ color: getPredictionColor(prediction.prediction) }}
              >
                {prediction.prediction}
              </div>
              <div className="prediction-confidence">
                {prediction.confidence}% confidence
              </div>
            </div>
            
            <div className="prediction-details">
              <div className="price-info">
                <span>Entry: ${prediction.price}</span>
                <span>Target: ${prediction.targetPrice}</span>
              </div>
              <div className="prediction-meta">
                <span className="prediction-date">{prediction.date}</span>
                <span 
                  className="prediction-status"
                  style={{ color: getStatusColor(prediction.status) }}
                >
                  {prediction.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {predictions.length === 0 && (
        <div className="empty-state">
          <h3>No predictions yet</h3>
          <p>Your stock predictions will appear here once you start analyzing stocks.</p>
        </div>
      )}
    </div>
  );
}
