import React, { useState } from 'react';
import './ModelPreview.css';
import ModelDeployment from './ModelDeployment';

export default function ModelPreview({ model, onBack, onEdit }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showDeployment, setShowDeployment] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDeploy = () => {
    setShowDeployment(true);
  };

  // Show deployment screen if user clicked deploy
  if (showDeployment) {
    return (
      <ModelDeployment 
        model={model}
        onBack={() => setShowDeployment(false)}
      />
    );
  }

  return (
    <div className={`model-preview ${isFullscreen ? 'fullscreen' : ''}`}>
      {/* Header */}
      <div className="preview-header">
        <div className="header-left">
          <div className="model-info">
            <h2>{model.name}</h2>
            <span className="model-meta">
              Created: {new Date(model.created).toLocaleDateString()} • 
              {model.widgets.length} Widgets
            </span>
          </div>
        </div>
        <div className="header-right">
          <button className="fullscreen-btn" onClick={toggleFullscreen}>
            {isFullscreen ? '🗗' : '🗖'} {isFullscreen ? 'Exit' : 'Fullscreen'}
          </button>
          <button className="edit-btn" onClick={onEdit}>
            ✏️ Edit Model
          </button>
          <button className="deploy-btn" onClick={handleDeploy}>
            🚀 Deploy Model
          </button>
        </div>
      </div>

      {/* Preview Canvas */}
      <div className="preview-canvas">
        <div className="canvas-viewport">
          {model.widgets.map(widget => (
            <PreviewWidget key={widget.id} widget={widget} />
          ))}
          
          {model.widgets.length === 0 && (
            <div className="empty-preview">
              <div className="empty-icon">📊</div>
              <h3>No widgets in this model</h3>
              <p>Go back to the builder to add widgets</p>
            </div>
          )}
        </div>
      </div>

      {/* Model Stats */}
      <div className="model-stats">
        <div className="stat-card">
          <div className="stat-value">{model.widgets.length}</div>
          <div className="stat-label">Widgets</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {model.widgets.filter(w => w.name.includes('Chart')).length}
          </div>
          <div className="stat-label">Charts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {model.widgets.filter(w => w.category === 'Trade').length}
          </div>
          <div className="stat-label">Trade Tools</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">Ready</div>
          <div className="stat-label">Status</div>
        </div>
      </div>
    </div>
  );
}

// Preview Widget Component (Read-only version)
function PreviewWidget({ widget }) {
  return (
    <div
      className="preview-widget"
      style={{
        left: widget.x,
        top: widget.y,
        width: widget.width,
        height: widget.height,
        zIndex: widget.zIndex
      }}
    >
      <div className="widget-header">
        <span className="widget-title">
          {widget.icon} {widget.name}
        </span>
        <div className="widget-status">
          <span className="status-dot"></span>
          Ready
        </div>
      </div>
      
      <div className="widget-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">{widget.icon}</div>
          <p>Live Data</p>
          <small>Will show real data when deployed</small>
        </div>
      </div>
    </div>
  );
}