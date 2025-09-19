import { useState } from 'react';

const StockSearch = ({ onSymbolSelect, placeholder = "Search stocks..." }) => {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);

  const popularStocks = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'MSFT', name: 'Microsoft Corporation' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation' },
    { symbol: 'META', name: 'Meta Platforms Inc.' },
    { symbol: 'NFLX', name: 'Netflix Inc.' }
  ];

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.length > 0);
  };

  const handleSymbolClick = (symbol, name) => {
    setQuery(symbol);
    setShowResults(false);
    onSymbolSelect && onSymbolSelect(symbol, name);
  };

  const filteredStocks = popularStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
    stock.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={query}
        onChange={handleSearchChange}
        onFocus={() => setShowResults(query.length > 0)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '16px'
        }}
      />
      
      {showResults && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000
        }}>
          {filteredStocks.length > 0 ? filteredStocks.map(stock => (
            <div
              key={stock.symbol}
              onClick={() => handleSymbolClick(stock.symbol, stock.name)}
              style={{
                padding: '12px',
                cursor: 'pointer',
                borderBottom: '1px solid #333',
                color: '#fff'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              <div style={{ fontWeight: 'bold' }}>{stock.symbol}</div>
              <div style={{ fontSize: '12px', color: '#999' }}>{stock.name}</div>
            </div>
          )) : (
            <div style={{ padding: '12px', color: '#999' }}>
              No stocks found. Try searching for: AAPL, TSLA, MSFT...
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;