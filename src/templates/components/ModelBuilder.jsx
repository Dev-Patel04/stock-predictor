import React, { useState, useRef } from 'react';
import './ModelBuilder.css';
import ModelPreview from './ModelPreview';

export default function ModelBuilder({ onBack, onSave }) {
  const [widgets, setWidgets] = useState([]);
  const [draggedWidget, setDraggedWidget] = useState(null);
  const [selectedWidget, setSelectedWidget] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [savedModel, setSavedModel] = useState(null);
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
    const modelName = prompt('Enter a name for your model:', `Trading Model ${new Date().toLocaleDateString()}`);
    
    if (!modelName || modelName.trim() === '') {
      return; // User cancelled or entered empty name
    }
    
    const modelData = {
      name: modelName.trim(),
      widgets: widgets,
      created: new Date().toISOString()
    };
    
    console.log('Saving model:', modelData);
    setSavedModel(modelData);
    setShowPreview(true);
    onSave && onSave(modelData);
  };

  // Show preview screen if model was saved
  if (showPreview && savedModel) {
    return (
      <ModelPreview 
        model={savedModel}
        onBack={() => setShowPreview(false)}
        onEdit={() => setShowPreview(false)}
      />
    );
  }

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
              <label>Resize</label>
              <p className="resize-hint">💡 Drag widget edges to resize</p>
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
  const [resizeDirection, setResizeDirection] = useState('');
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0, startX: 0, startY: 0 });

  const getResizeDirection = (e, rect) => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const edgeThreshold = 8;
    
    const nearTop = y <= edgeThreshold;
    const nearBottom = y >= rect.height - edgeThreshold;
    const nearLeft = x <= edgeThreshold;
    const nearRight = x >= rect.width - edgeThreshold;
    
    if (nearTop && nearLeft) return 'nw';
    if (nearTop && nearRight) return 'ne';
    if (nearBottom && nearLeft) return 'sw';
    if (nearBottom && nearRight) return 'se';
    if (nearTop) return 'n';
    if (nearBottom) return 's';
    if (nearLeft) return 'w';
    if (nearRight) return 'e';
    
    return '';
  };

  const getCursor = (direction) => {
    const cursors = {
      'n': 'n-resize',
      's': 's-resize',
      'e': 'e-resize',
      'w': 'w-resize',
      'ne': 'ne-resize',
      'nw': 'nw-resize',
      'se': 'se-resize',
      'sw': 'sw-resize'
    };
    return cursors[direction] || 'move';
  };

  const handleMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const direction = getResizeDirection(e, rect);
    
    if (direction && isSelected) {
      setIsResizing(true);
      setResizeDirection(direction);
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: widget.width,
        height: widget.height,
        startX: widget.x,
        startY: widget.y
      });
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
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      let newWidth = resizeStart.width;
      let newHeight = resizeStart.height;
      let newX = resizeStart.startX;
      let newY = resizeStart.startY;
      
      if (resizeDirection.includes('e')) {
        newWidth = Math.max(100, resizeStart.width + deltaX);
      }
      if (resizeDirection.includes('w')) {
        // Calculate new width (expanding left means growing the widget)
        const proposedWidth = resizeStart.width - deltaX;
        newWidth = Math.max(100, proposedWidth);
        // Position the widget so its right edge stays fixed
        newX = resizeStart.startX + resizeStart.width - newWidth;
      }
      if (resizeDirection.includes('s')) {
        newHeight = Math.max(80, resizeStart.height + deltaY);
      }
      if (resizeDirection.includes('n')) {
        // Calculate new height (expanding up means growing the widget)
        const proposedHeight = resizeStart.height - deltaY;
        newHeight = Math.max(80, proposedHeight);
        // Position the widget so its bottom edge stays fixed
        newY = resizeStart.startY + resizeStart.height - newHeight;
      }
      
      onResize(widget.id, newWidth, newHeight);
      if (newX !== resizeStart.startX || newY !== resizeStart.startY) {
        onMove(widget.id, newX, newY);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeDirection('');
  };

  const handleMouseMoveOnWidget = (e) => {
    if (!isDragging && !isResizing && isSelected) {
      const rect = e.currentTarget.getBoundingClientRect();
      const direction = getResizeDirection(e, rect);
      e.currentTarget.style.cursor = getCursor(direction);
    }
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
  }, [isDragging, isResizing, dragStart, resizeStart, widget]);

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
      onMouseMove={handleMouseMoveOnWidget}
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
    </div>
  );
}