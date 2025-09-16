import React, { useState, useRef } from 'react';
import './ModelBuilder.css';

export default function ModelBuilder({ onBack, onSave }) {
  const [widgets, setWidgets] = useState([]);
  const [draggedWidget, setDraggedWidget] = useState(null);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const canvasRef = useRef(null);

  // Available widgets based on the Webull interface
  const availableWidgets = [
    { id: 'chart', name: 'Chart', icon: '📈', category: 'Quote', description: 'Real-time stock chart' },
    { id: 'options', name: 'Options', icon: '📋', category: 'Quote', description: 'Options data' },
    { id: 'quotes', name: 'Quotes', icon: '💰', category: 'Quote', description: 'Live quotes' },
    { id: 'key-stats', name: 'Key Statistics', icon: '📊', category: 'Quote', description: 'Key metrics' },
    { id: 'time-sales', name: 'Time & Sales', icon: '⏰', category: 'Quote', description: 'Transaction history' },
    { id: 'volume-analysis', name: 'Volume Analysis', icon: '📶', category: 'Quote', description: 'Volume patterns' },
    { id: 'order-book', name: 'Order Book', icon: '📖', category: 'Trade', description: 'Market depth' },
    { id: 'noii', name: 'NOII', icon: '🔔', category: 'Trade', description: 'Imbalance info' },
    { id: 'options-stats', name: 'Options Statistics', icon: '🎯', category: 'Trade', description: 'Options analytics' },
    { id: 'warrants', name: 'Warrant & CBBC', icon: '📜', category: 'Trade', description: 'Warrants data' },
    { id: 'brokers', name: 'Brokers', icon: '🏢', category: 'Trade', description: 'Broker activity' }
  ];

  const handleDragStart = (widget) => {
    setDraggedWidget(widget);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    
    if (draggedWidget && canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      
      const newWidget = {
        ...draggedWidget,
        id: `${draggedWidget.id}-${Date.now()}`,
        x: Math.max(0, x - 100), // Center widget on cursor
        y: Math.max(0, y - 75),
        width: 200,
        height: 150,
        zIndex: widgets.length + 1
      };
      
      setWidgets([...widgets, newWidget]);
      setDraggedWidget(null);
    }
  };

  const handleWidgetSelect = (widget) => {
    setSelectedWidget(widget);
  };

  const handleWidgetMove = (widgetId, newX, newY) => {
    setWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, x: newX, y: newY } : w
    ));
  };

  const handleWidgetResize = (widgetId, newWidth, newHeight) => {
    setWidgets(widgets.map(w => 
      w.id === widgetId ? { ...w, width: newWidth, height: newHeight } : w
    ));
  };

  const handleWidgetDelete = (widgetId) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
    setSelectedWidget(null);
  };

  const handleSave = () => {
    const modelData = {
      name: `Custom Model ${new Date().toLocaleDateString()}`,
      widgets: widgets,
      created: new Date().toISOString()
    };
    
    console.log('Saving model:', modelData);
    alert('Model saved successfully! (Backend integration coming soon)');
    onSave && onSave(modelData);
  };

  return (
    <div className="model-builder">
      {/* Header */}
      <div className="builder-header">
        <div className="header-left">
          <button className="back-btn" onClick={onBack}>
            ← Back
          </button>
          <h2>Model Builder</h2>
        </div>
        <div className="header-right">
          <button className="save-btn" onClick={handleSave}>
            Save Model
          </button>
        </div>
      </div>

      <div className="builder-content">
        {/* Widget Library Panel */}
        <div className="widget-library">
          <div className="library-header">
            <h3>Add Widgets</h3>
            <p>Drag widgets to canvas</p>
          </div>
          
          <div className="widget-categories">
            <div className="category">
              <h4>Quote</h4>
              <div className="widget-grid">
                {availableWidgets.filter(w => w.category === 'Quote').map(widget => (
                  <div
                    key={widget.id}
                    className="widget-item"
                    draggable
                    onDragStart={() => handleDragStart(widget)}
                  >
                    <div className="widget-icon">{widget.icon}</div>
                    <span className="widget-name">{widget.name}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="category">
              <h4>Trade</h4>
              <div className="widget-grid">
                {availableWidgets.filter(w => w.category === 'Trade').map(widget => (
                  <div
                    key={widget.id}
                    className="widget-item"
                    draggable
                    onDragStart={() => handleDragStart(widget)}
                  >
                    <div className="widget-icon">{widget.icon}</div>
                    <span className="widget-name">{widget.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div 
          className="canvas-container"
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="canvas">
            {widgets.length === 0 ? (
              <div className="canvas-placeholder">
                <div className="placeholder-icon">🎯</div>
                <h3>Drag widgets here to build your model</h3>
                <p>Start by dragging a Chart widget from the library</p>
              </div>
            ) : (
              widgets.map(widget => (
                <CanvasWidget
                  key={widget.id}
                  widget={widget}
                  isSelected={selectedWidget?.id === widget.id}
                  onSelect={handleWidgetSelect}
                  onMove={handleWidgetMove}
                  onResize={handleWidgetResize}
                  onDelete={handleWidgetDelete}
                />
              ))
            )}
          </div>
        </div>

        {/* Properties Panel */}
        {selectedWidget && (
          <div className="properties-panel">
            <div className="panel-header">
              <h3>Widget Properties</h3>
              <button 
                className="delete-widget-btn"
                onClick={() => handleWidgetDelete(selectedWidget.id)}
              >
                🗑️
              </button>
            </div>
            
            <div className="property-group">
              <label>Widget: {selectedWidget.name}</label>
              <p className="widget-description">{selectedWidget.description}</p>
            </div>
            
            <div className="property-group">
              <label>Position</label>
              <div className="position-inputs">
                <input 
                  type="number" 
                  value={Math.round(selectedWidget.x)} 
                  onChange={(e) => handleWidgetMove(selectedWidget.id, parseInt(e.target.value), selectedWidget.y)}
                  placeholder="X"
                />
                <input 
                  type="number" 
                  value={Math.round(selectedWidget.y)} 
                  onChange={(e) => handleWidgetMove(selectedWidget.id, selectedWidget.x, parseInt(e.target.value))}
                  placeholder="Y"
                />
              </div>
            </div>
            
            <div className="property-group">
              <label>Size</label>
              <div className="size-inputs">
                <input 
                  type="number" 
                  value={selectedWidget.width} 
                  onChange={(e) => handleWidgetResize(selectedWidget.id, parseInt(e.target.value), selectedWidget.height)}
                  placeholder="Width"
                />
                <input 
                  type="number" 
                  value={selectedWidget.height} 
                  onChange={(e) => handleWidgetResize(selectedWidget.id, selectedWidget.width, parseInt(e.target.value))}
                  placeholder="Height"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Canvas Widget Component
function CanvasWidget({ widget, isSelected, onSelect, onMove, onResize, onDelete }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.target.classList.contains('resize-handle')) {
      setIsResizing(true);
    } else {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - widget.x,
        y: e.clientY - widget.y
      });
    }
    onSelect(widget);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = Math.max(0, e.clientX - dragStart.x);
      const newY = Math.max(0, e.clientY - dragStart.y);
      onMove(widget.id, newX, newY);
    } else if (isResizing) {
      const newWidth = Math.max(100, e.clientX - widget.x);
      const newHeight = Math.max(80, e.clientY - widget.y);
      onResize(widget.id, newWidth, newHeight);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, widget]);

  return (
    <div
      className={`canvas-widget ${isSelected ? 'selected' : ''}`}
      style={{
        left: widget.x,
        top: widget.y,
        width: widget.width,
        height: widget.height,
        zIndex: widget.zIndex
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="widget-header">
        <span className="widget-title">
          {widget.icon} {widget.name}
        </span>
        <button 
          className="widget-close"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(widget.id);
          }}
        >
          ×
        </button>
      </div>
      
      <div className="widget-content">
        <div className="coming-soon">
          <div className="coming-soon-icon">{widget.icon}</div>
          <p>Coming Soon</p>
          <small>API integration pending</small>
        </div>
      </div>
      
      {isSelected && (
        <div className="resize-handle"></div>
      )}
    </div>
  );
}