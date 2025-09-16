import React, { useState } from 'react';
import './ExistingModels.css';

export default function ExistingModels({ onBack }) {
  const [selectedModel, setSelectedModel] = useState(null);

  // Preset template data - moved from ModelTemplate
  const existingModels = [
    {
      id: 1,
      name: "LSTM Basic",
      description: "Long Short-Term Memory neural network for stock prediction",
      accuracy: "78%",
      timeframe: "1-7 days",
      difficulty: "Beginner"
    },
    {
      id: 2,
      name: "Random Forest",
      description: "Ensemble learning method for market trend analysis",
      accuracy: "82%",
      timeframe: "1-30 days",
      difficulty: "Intermediate"
    },
    {
      id: 3,
      name: "GRU Advanced",
      description: "Gated Recurrent Unit with technical indicators",
      accuracy: "85%",
      timeframe: "1-14 days",
      difficulty: "Advanced"
    }
  ];

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    console.log('Selected existing model:', model);
  };

  const handleUseModel = () => {
    if (selectedModel) {
      // Will implement model usage logic later
      console.log('Using model:', selectedModel);
      alert(`Using ${selectedModel.name} model - implementation coming soon!`);
    }
  };

  return (
    <div className="existing-models-container">
      <div className="existing-models-header">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>
        <h2>Choose Existing Model</h2>
        <p>Select from our pre-built prediction models</p>
      </div>

      <div className="models-grid">
        {existingModels.map((model) => (
          <div 
            key={model.id}
            className={`model-card ${selectedModel?.id === model.id ? 'selected' : ''}`}
            onClick={() => handleModelSelect(model)}
          >
            <div className="model-content">
              <div className="model-header-info">
                <h3>{model.name}</h3>
                <div className="model-badges">
                  <span className="accuracy-badge">{model.accuracy}</span>
                  <span className={`difficulty-badge ${model.difficulty.toLowerCase()}`}>
                    {model.difficulty}
                  </span>
                </div>
              </div>
              
              <p className="model-description">{model.description}</p>
              
              <div className="model-stats">
                <div className="stat">
                  <span className="stat-label">Timeframe:</span>
                  <span className="stat-value">{model.timeframe}</span>
                </div>
              </div>
              
              <div className="model-actions">
                <button className="use-model-btn">
                  Select Model
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedModel && (
        <div className="model-preview">
          <h3>Selected: {selectedModel.name}</h3>
          <p>Ready to use this model for your stock predictions?</p>
          <div className="preview-actions">
            <button className="cancel-btn" onClick={() => setSelectedModel(null)}>
              Cancel
            </button>
            <button className="use-selected-btn" onClick={handleUseModel}>
              Use This Model
            </button>
          </div>
        </div>
      )}
    </div>
  );
}