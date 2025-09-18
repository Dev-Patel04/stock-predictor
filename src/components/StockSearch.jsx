import { useState, useEffect, useRef } from 'react';
import yahooFinanceService from '../services/stock/yahooFinanceService';
import polygonService from '../services/stock/polygonService';
import './StockSearch.css';

const StockSearch = ({ onSymbolSelect, placeholder = "Search stocks..." }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState(null);
  const debounceTimeout = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      // Debounce search requests
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }

      debounceTimeout.current = setTimeout(() => {
        searchStocks(query);
      }, 300);
    } else {
      setResults([]);
      setShowResults(false);
    }

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [query]);

  const searchStocks = async (searchQuery) => {
    setLoading(true);
    setError(null);

    try {
      // Try Yahoo Finance first for broader search
      let searchResults = [];
      
      try {
        const yahooResults = await yahooFinanceService.searchSymbols(searchQuery);
        if (yahooResults.quotes && yahooResults.quotes.length > 0) {
          searchResults = formatYahooResults(yahooResults.quotes);
        }
      } catch (yahooError) {
        console.warn('Yahoo search failed, trying Polygon:', yahooError);
        
        // Fallback to Polygon search
        try {
          const polygonResults = await polygonService.searchTickers(searchQuery);
          if (polygonResults && polygonResults.length > 0) {
            searchResults = formatPolygonResults(polygonResults);
          }
        } catch (polygonError) {
          console.error('Both search services failed:', polygonError);
          setError('Search service unavailable');
        }
      }

      setResults(searchResults);
      setShowResults(true);
    } catch (error) {
      console.error('Search error:', error);
      setError('Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const formatYahooResults = (quotes) => {
    return quotes
      .filter(quote => quote.symbol && quote.shortname)
      .slice(0, 10)
      .map(quote => ({
        symbol: quote.symbol,
        name: quote.shortname || quote.longname || 'N/A',
        exchange: quote.exchange || 'N/A',
        type: quote.quoteType || 'EQUITY',
        market: quote.market || 'us_market',
        source: 'yahoo'
      }));
  };

  const formatPolygonResults = (tickers) => {
    return tickers
      .filter(ticker => ticker.ticker && ticker.name)
      .slice(0, 10)
      .map(ticker => ({
        symbol: ticker.ticker,
        name: ticker.name,
        exchange: ticker.primaryExchange || 'N/A',
        type: ticker.type || 'CS',
        market: ticker.market || 'stocks',
        source: 'polygon'
      }));
  };

  const handleSelectSymbol = (symbol, name) => {
    setQuery(`${symbol} - ${name}`);
    setShowResults(false);
    setResults([]);
    
    if (onSymbolSelect) {
      onSymbolSelect(symbol, name);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    if (value.length < 2) {
      setResults([]);
      setShowResults(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      'EQUITY': '#26a69a',
      'ETF': '#2196f3',
      'MUTUALFUND': '#ff9800',
      'INDEX': '#9c27b0',
      'CS': '#26a69a', // Common Stock
      'default': '#757575'
    };
    return colors[type] || colors.default;
  };

  const getTypeLabel = (type) => {
    const labels = {
      'EQUITY': 'Stock',
      'ETF': 'ETF',
      'MUTUALFUND': 'Mutual Fund',
      'INDEX': 'Index',
      'CS': 'Stock',
      'default': 'Security'
    };
    return labels[type] || labels.default;
  };

  return (
    <div className="stock-search" ref={searchRef}>
      <div className="search-input-container">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="search-input"
          onFocus={() => results.length > 0 && setShowResults(true)}
        />
        {loading && <div className="search-spinner">⟳</div>}
      </div>

      {showResults && (
        <div className="search-results">
          {error && (
            <div className="search-error">
              {error}
            </div>
          )}
          
          {results.length === 0 && !loading && !error && (
            <div className="no-results">
              No stocks found for "{query}"
            </div>
          )}

          {results.map((result, index) => (
            <div
              key={`${result.symbol}-${index}`}
              className="search-result-item"
              onClick={() => handleSelectSymbol(result.symbol, result.name)}
            >
              <div className="result-main">
                <div className="result-symbol">
                  {result.symbol}
                  <span 
                    className="result-type"
                    style={{ backgroundColor: getTypeColor(result.type) }}
                  >
                    {getTypeLabel(result.type)}
                  </span>
                </div>
                <div className="result-name">{result.name}</div>
              </div>
              <div className="result-meta">
                <span className="result-exchange">{result.exchange}</span>
                <span className="result-source">{result.source}</span>
              </div>
            </div>
          ))}

          {results.length > 0 && (
            <div className="search-footer">
              Powered by {results[0]?.source === 'yahoo' ? 'Yahoo Finance' : 'Polygon.io'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;