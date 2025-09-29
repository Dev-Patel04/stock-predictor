import React from 'react';

const StockViewerDebug = ({ initialSymbol, onBack }) => {
  console.log('StockViewerDebug rendered with symbol:', initialSymbol);
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: '#eee', minHeight: '100vh' }}>
      <button onClick={onBack} style={{ padding: '10px', marginBottom: '20px' }}>
        ← Back to Dashboard
      </button>
      <h1>Stock Viewer Debug</h1>
      <p>Symbol: {initialSymbol}</p>
      <p>This is a test to see if the component renders properly.</p>
    </div>
  );
};

export default StockViewerDebug;