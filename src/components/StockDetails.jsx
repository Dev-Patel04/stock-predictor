import React from 'react';

const StockDetails = ({ symbol }) => (
  <div style={{ padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '8px', color: '#fff' }}>
    <h3>Stock Details for {symbol}</h3>
    <p>Loading stock information...</p>
  </div>
);

export default StockDetails;