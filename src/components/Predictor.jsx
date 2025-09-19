import React, { useState, useEffect } from 'react';
import StockSearch from './StockSearch';
import TradingChart from './TradingChart';
import StockDetails from './StockDetails';
// Import the model system components
import ModelBuilder from './ModelBuilder';
import ExistingModels from './ExistingModels';
import ModelPreview from './ModelPreview';
import TradingDashboard from './TradingDashboard';
import './Predictor.css';

const Predictor = ({ initialSymbol = 'AAPL' }) => {
  const [selectedSymbol, setSelectedSymbol] = useState(initialSymbol);
  const [selectedCompany, setSelectedCompany] = useState('Apple Inc.');
  const [timeframe, setTimeframe] = useState('1M');
  const [error, setError] = useState(null);
  const [currentView, setCurrentView] = useState('home'); // home, builder, existing, preview, dashboard
  const [currentModel, setCurrentModel] = useState(null);
  const [savedModels, setSavedModels] = useState([]);
  const [activeSignals, setActiveSignals] = useState(null);
  const [isGeneratingSignals, setIsGeneratingSignals] = useState(false);

  // Update selected symbol when initialSymbol changes
  useEffect(() => {
    console.log('Predictor mounted with initialSymbol:', initialSymbol);
    try {
      if (initialSymbol && initialSymbol !== selectedSymbol) {
        setSelectedSymbol(initialSymbol);
        setSelectedCompany(`${initialSymbol} Inc.`);
      }
    } catch (err) {
      console.error('Error updating symbol:', err);
      setError('Failed to update symbol');
    }
  }, [initialSymbol, selectedSymbol]);

  const handleSymbolSelect = (symbol, name) => {
    try {
      console.log('Symbol selected:', symbol, name);
      setSelectedSymbol(symbol);
      setSelectedCompany(name || `${symbol} Inc.`);
      setError(null);
    } catch (err) {
      console.error('Error selecting symbol:', err);
      setError('Failed to select symbol');
    }
  };

  const handleTimeframeChange = (newTimeframe) => {
    try {
      console.log('Timeframe changed to:', newTimeframe);
      setTimeframe(newTimeframe);
    } catch (err) {
      console.error('Error changing timeframe:', err);
      setError('Failed to change timeframe');
    }
  };

  const handleModelSave = (modelData) => {
    console.log('Model saved:', modelData);
    setSavedModels(prev => [...prev, modelData]);
    setCurrentModel(modelData);
    setCurrentView('preview');
  };

  const handleModelSelect = (modelConfig, signals) => {
    console.log('Model selected:', modelConfig, 'Signals:', signals);
    setCurrentModel(modelConfig);
    setActiveSignals(signals);
    setCurrentView('dashboard'); // Switch to dashboard view to show signals
  };

  // Model Builder View
  if (currentView === 'builder') {
    return (
      <ModelBuilder
        onBack={() => setCurrentView('home')}
        onSave={handleModelSave}
      />
    );
  }

  // Existing Models View
  if (currentView === 'existing') {
    return (
      <ExistingModels
        onBack={() => setCurrentView('home')}
        onModelSelect={handleModelSelect}
      />
    );
  }

  // Model Preview View
  if (currentView === 'preview' && currentModel) {
    return (
      <ModelPreview
        model={currentModel}
        onBack={() => setCurrentView('home')}
        onEdit={() => setCurrentView('builder')}
        onDeploy={() => setCurrentView('dashboard')}
      />
    );
  }

  // Trading Dashboard View
  if (currentView === 'dashboard' && currentModel) {
    return (
      <TradingDashboard
        model={currentModel}
        config={{
          symbol: selectedSymbol,
          timeframe: timeframe,
          paperTradingBalance: 100000
        }}
        signals={activeSignals}
        onBack={() => setCurrentView('home')}
      />
    );
  }

  if (error) {
    return (
      <div className="predictor error-state">
        <div className="predictor-header">
          <h2>Stock Analysis & Prediction</h2>
          <p style={{ color: '#ef5350' }}>Error: {error}</p>
          <button 
            onClick={() => {
              setError(null);
              setSelectedSymbol('AAPL');
              setSelectedCompany('Apple Inc.');
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#0066cc',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Reset to Default
          </button>
        </div>
      </div>
    );
  }

  // Main Home View with Model Selection
  return (
    <div className="predictor">
      <div className="predictor-header">
        <h2>Stock Analysis & Prediction</h2>
        <p>AI-Powered Model-Based Trading System</p>
      </div>

      {/* Model Selection Section */}
      <div className="model-selection-section">
        <h3 style={{ color: '#fff', marginBottom: '20px', textAlign: 'center' }}>
          🤖 Choose Your Prediction Model
        </h3>
        
        <div className="model-choice-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '40px'
        }}>
          <div className="choice-card" style={{
            backgroundColor: '#1a1a1a',
            border: '2px solid #4CAF50',
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setCurrentView('builder')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)';
            e.target.style.boxShadow = '0 10px 25px rgba(76, 175, 80, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎯</div>
            <h4 style={{ color: '#4CAF50', margin: '0 0 10px 0' }}>Build Custom Model</h4>
            <p style={{ color: '#999', lineHeight: '1.5' }}>
              Design your own trading model by selecting widgets like charts, options, volume, 
              technical indicators, and configure AI-powered signal generation
            </p>
          </div>

          <div className="choice-card" style={{
            backgroundColor: '#1a1a1a',
            border: '2px solid #2196F3',
            borderRadius: '12px',
            padding: '30px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setCurrentView('existing')}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-5px)';
            e.target.style.boxShadow = '0 10px 25px rgba(33, 150, 243, 0.3)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
          >
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>🏛️</div>
            <h4 style={{ color: '#2196F3', margin: '0 0 10px 0' }}>Use Preset Model</h4>
            <p style={{ color: '#999', lineHeight: '1.5' }}>
              Choose from our professionally designed models: LSTM, Random Forest, 
              GRU, and more with proven track records and different strategies
            </p>
          </div>
        </div>
      </div>

      {/* Current Stock Analysis Preview */}
      <div className="preview-section">
        <h3 style={{ color: '#fff', marginBottom: '20px' }}>
          📊 Quick Analysis Preview for {selectedSymbol}
        </h3>
        
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
                      style={{
                        padding: '8px 12px',
                        margin: '0 4px',
                        backgroundColor: timeframe === tf ? '#0066cc' : '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <TradingChart 
                symbol={selectedSymbol} 
                timeframe={timeframe}
                height={400}
              />
            </div>

            <div className="details-section">
              <StockDetails symbol={selectedSymbol} />
            </div>
          </div>
        )}
      </div>

      <div className="features-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '30px'
      }}>
        <div className="feature-card" style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h4 style={{ color: '#fff', marginBottom: '10px' }}>🎛️ Widget-Based Models</h4>
          <p style={{ color: '#999', lineHeight: '1.5' }}>Build custom models by dragging and dropping widgets: charts, options, volume, RSI, MACD, and more</p>
        </div>
        <div className="feature-card" style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h4 style={{ color: '#fff', marginBottom: '10px' }}>🤖 AI Signal Generation</h4>
          <p style={{ color: '#999', lineHeight: '1.5' }}>Your models generate intelligent trading signals based on the widgets and strategies you configure</p>
        </div>
        <div className="feature-card" style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h4 style={{ color: '#fff', marginBottom: '10px' }}>🏛️ Preset Models</h4>
          <p style={{ color: '#999', lineHeight: '1.5' }}>Choose from LSTM, Random Forest, GRU models with different accuracy levels and strategies</p>
        </div>
        <div className="feature-card" style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h4 style={{ color: '#fff', marginBottom: '10px' }}>💬 AI Chat Interface</h4>
          <p style={{ color: '#999', lineHeight: '1.5' }}>Describe your model in plain text and let AI help you design the perfect widget configuration</p>
        </div>
        <div className="feature-card" style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h4 style={{ color: '#fff', marginBottom: '10px' }}>📈 Live Trading Dashboard</h4>
          <p style={{ color: '#999', lineHeight: '1.5' }}>Deploy your models to a live dashboard with real-time signals, portfolio tracking, and performance metrics</p>
        </div>
        <div className="feature-card" style={{
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h4 style={{ color: '#fff', marginBottom: '10px' }}>⚙️ Full Customization</h4>
          <p style={{ color: '#999', lineHeight: '1.5' }}>Configure risk levels, timeframes, auto-execution, notifications, and backtesting parameters</p>
        </div>
      </div>
    </div>
  );
};

export default Predictor;