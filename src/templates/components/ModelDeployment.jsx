import React, { useState, useEffect } from 'react';
import './ModelDeployment.css';
import TradingDashboard from './TradingDashboard';

export default function ModelDeployment({ model, onBack }) {
  const [deploymentStep, setDeploymentStep] = useState('setup'); // setup, deploying, deployed
  const [deploymentConfig, setDeploymentConfig] = useState({
    paperTradingBalance: 100000,
    maxPositionSize: 5000,
    maxDailyLoss: 2000,
    riskPerTrade: 2,
    enableNotifications: true,
    tradingHours: 'market',
    autoExecution: false
  });
  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    console.log('handleDeploy called');
    console.log('Current model:', model);
    console.log('Current config:', deploymentConfig);
    
    setIsDeploying(true);
    setDeploymentStep('deploying');
    
    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    console.log('Setting deployment step to deployed');
    setDeploymentStep('deployed');
    setIsDeploying(false);
  };

  const handleConfigChange = (key, value) => {
    setDeploymentConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  if (deploymentStep === 'deployed') {
    // Debug logging
    console.log('ModelDeployment - rendering deployed step');
    console.log('Model data:', model);
    console.log('Config data:', deploymentConfig);
    
    // Add safety checks before rendering TradingDashboard
    if (!model || !model.widgets) {
      console.error('ModelDeployment: Invalid model data', model);
      return (
        <div className="model-deployment">
          <div className="error-state">
            <h2>Deployment Error</h2>
            <p>Invalid model configuration detected.</p>
            <button 
              className="btn-secondary"
              onClick={() => setDeploymentStep('setup')}
            >
              ← Back to Setup
            </button>
          </div>
        </div>
      );
    }
    
    console.log('ModelDeployment - rendering TradingDashboard');
    return (
      <TradingDashboard 
        model={model}
        config={deploymentConfig}
        onBack={() => {
          console.log('Going back from TradingDashboard to setup');
          setDeploymentStep('setup');
        }}
      />
    );
  }

  return (
    <div className="model-deployment">
      {/* Header */}
      <div className="deployment-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            ← Back to Preview
          </button>
          <div className="model-info">
            <h2>Deploy "{model.name}"</h2>
            <span className="model-meta">
              {model.widgets.length} Widgets • Paper Trading Mode
            </span>
          </div>
        </div>
        <div className="deployment-status">
          {deploymentStep === 'setup' && (
            <span className="status-badge setup">⚙️ Configuration</span>
          )}
          {deploymentStep === 'deploying' && (
            <span className="status-badge deploying">🚀 Deploying...</span>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="deployment-content">
        {deploymentStep === 'setup' && (
          <>
            {/* Configuration Panel */}
            <div className="config-panel">
              <h3>📊 Trading Configuration</h3>
              
              {/* Paper Trading Setup */}
              <div className="config-section">
                <h4>💰 Paper Trading Account</h4>
                <div className="config-row">
                  <label>Starting Balance</label>
                  <div className="input-group">
                    <span className="currency">$</span>
                    <input 
                      type="number" 
                      value={deploymentConfig.paperTradingBalance}
                      onChange={(e) => handleConfigChange('paperTradingBalance', parseInt(e.target.value))}
                      min="10000"
                      max="1000000"
                      step="10000"
                    />
                  </div>
                </div>
              </div>

              {/* Risk Management */}
              <div className="config-section">
                <h4>⚠️ Risk Management</h4>
                <div className="config-row">
                  <label>Max Position Size</label>
                  <div className="input-group">
                    <span className="currency">$</span>
                    <input 
                      type="number" 
                      value={deploymentConfig.maxPositionSize}
                      onChange={(e) => handleConfigChange('maxPositionSize', parseInt(e.target.value))}
                      min="1000"
                      max="50000"
                      step="1000"
                    />
                  </div>
                </div>
                
                <div className="config-row">
                  <label>Max Daily Loss</label>
                  <div className="input-group">
                    <span className="currency">$</span>
                    <input 
                      type="number" 
                      value={deploymentConfig.maxDailyLoss}
                      onChange={(e) => handleConfigChange('maxDailyLoss', parseInt(e.target.value))}
                      min="500"
                      max="10000"
                      step="500"
                    />
                  </div>
                </div>

                <div className="config-row">
                  <label>Risk Per Trade</label>
                  <div className="input-group">
                    <input 
                      type="number" 
                      value={deploymentConfig.riskPerTrade}
                      onChange={(e) => handleConfigChange('riskPerTrade', parseFloat(e.target.value))}
                      min="0.5"
                      max="5"
                      step="0.5"
                    />
                    <span className="unit">%</span>
                  </div>
                </div>
              </div>

              {/* Trading Settings */}
              <div className="config-section">
                <h4>⏰ Trading Settings</h4>
                <div className="config-row">
                  <label>Trading Hours</label>
                  <select 
                    value={deploymentConfig.tradingHours}
                    onChange={(e) => handleConfigChange('tradingHours', e.target.value)}
                  >
                    <option value="market">Market Hours Only (9:30 AM - 4:00 PM EST)</option>
                    <option value="extended">Extended Hours (4:00 AM - 8:00 PM EST)</option>
                    <option value="24/7">24/7 (Crypto Assets Only)</option>
                  </select>
                </div>

                <div className="config-row checkbox-row">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={deploymentConfig.autoExecution}
                      onChange={(e) => handleConfigChange('autoExecution', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Auto-execute trades (signals will execute automatically)
                  </label>
                </div>

                <div className="config-row checkbox-row">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={deploymentConfig.enableNotifications}
                      onChange={(e) => handleConfigChange('enableNotifications', e.target.checked)}
                    />
                    <span className="checkmark"></span>
                    Enable desktop notifications for signals
                  </label>
                </div>
              </div>
            </div>

            {/* Model Preview */}
            <div className="model-preview-panel">
              <h3>📈 Model Summary</h3>
              <div className="model-widgets">
                {model.widgets.map((widget, index) => (
                  <div key={index} className="widget-summary">
                    <span className="widget-icon">{widget.icon}</span>
                    <div className="widget-details">
                      <span className="widget-name">{widget.name}</span>
                      <span className="widget-desc">{widget.description}</span>
                    </div>
                    <span className="widget-status">🟢 Ready</span>
                  </div>
                ))}
              </div>

              <div className="performance-estimate">
                <h4>📊 Estimated Performance</h4>
                <div className="estimate-grid">
                  <div className="estimate-card">
                    <span className="estimate-value">~12-18</span>
                    <span className="estimate-label">Signals/Day</span>
                  </div>
                  <div className="estimate-card">
                    <span className="estimate-value">~67%</span>
                    <span className="estimate-label">Win Rate</span>
                  </div>
                  <div className="estimate-card">
                    <span className="estimate-value">~1.8</span>
                    <span className="estimate-label">Risk/Reward</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {deploymentStep === 'deploying' && (
          <div className="deploying-screen">
            <div className="deploying-animation">
              <div className="rocket">🚀</div>
              <div className="deploying-text">
                <h3>Deploying Your Trading Model</h3>
                <div className="progress-steps">
                  <div className="step completed">✅ Validating model configuration</div>
                  <div className="step completed">✅ Initializing paper trading account</div>
                  <div className="step active">🔄 Connecting to market data feeds</div>
                  <div className="step">⏳ Starting signal generation engine</div>
                  <div className="step">⏳ Activating risk management systems</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      {deploymentStep === 'setup' && (
        <div className="deployment-footer">
          <div className="footer-info">
            <span className="info-text">
              💡 Paper trading uses real market data with virtual money. No real funds at risk.
            </span>
          </div>
          <div className="footer-actions">
            <button className="cancel-btn" onClick={onBack}>
              Cancel
            </button>
            <button 
              className="deploy-btn"
              onClick={handleDeploy}
              disabled={isDeploying}
            >
              {isDeploying ? 'Deploying...' : '🚀 Deploy Model'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}