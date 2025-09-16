import React from 'react';
import './ModelTemplate.css';

export default function ModelTemplate({ onBack, onCreateNew }) {
  const handleCreateNew = () => {
    onCreateNew();
  };

  return (
    <div className="model-template-container">
      <div className="template-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Create Your Own Model</h2>
        <p>Build a custom prediction model from scratch</p>
      </div>

      <div className="create-model-section">
        <div className="template-card create-new-card" onClick={handleCreateNew}>
          <div className="create-new-content">
            <div className="plus-icon">
              <span>+</span>
            </div>
            <h3>Create New Model</h3>
            <p>Build a custom prediction model from scratch</p>
            <div className="create-features">
              <ul>
                <li>Choose your own parameters</li>
                <li>Select training data sources</li>
                <li>Customize prediction algorithms</li>
                <li>Set your own timeframes</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="info-panel">
          <h3>Model Creation Process</h3>
          <div className="process-steps">
            <div className="step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h4>Configure Parameters</h4>
                <p>Set up your model's basic settings and prediction timeframe</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h4>Select Data Sources</h4>
                <p>Choose which market indicators and historical data to include</p>
              </div>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h4>Train & Test</h4>
                <p>Let AI train your model and validate its accuracy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}