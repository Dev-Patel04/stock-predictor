import React, { useState, useEffect } from 'react';
import newsAPIService from '../services/news/newsAPIService';
import './News.css';

export default function News() {
  const [symbol, setSymbol] = useState('AAPL');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stock');

  useEffect(() => {
    if (activeTab === 'market') {
      fetchMarketNews();
    }
  }, [activeTab]);

  const fetchStockNews = async () => {
    if (!symbol.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await newsAPIService.getStockNews(symbol);
      setNews(data.articles || []);
    } catch (err) {
      console.error('Error fetching stock news:', err);
      setError('Failed to fetch news. Please try again.');
      setNews([]);
    }
    setLoading(false);
  };

  const fetchMarketNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await newsAPIService.getBusinessNews();
      setNews(data.articles || []);
    } catch (err) {
      console.error('Error fetching market news:', err);
      setError('Failed to fetch market news. Please try again.');
      setNews([]);
    }
    setLoading(false);
  };

  const handleSymbolSubmit = (e) => {
    e.preventDefault();
    fetchStockNews();
  };

  return (
    <div className="news">
      <div className="news-header">
        <h2>Financial News</h2>
        <p>Stay updated with the latest market and stock-specific news</p>
      </div>

      <div className="news-tabs">
        <button
          className={`news-tab ${activeTab === 'stock' ? 'active' : ''}`}
          onClick={() => setActiveTab('stock')}
        >
          📈 Stock News
        </button>
        <button
          className={`news-tab ${activeTab === 'market' ? 'active' : ''}`}
          onClick={() => setActiveTab('market')}
        >
          🌍 Market News
        </button>
      </div>

      {activeTab === 'stock' && (
        <form onSubmit={handleSymbolSubmit} className="search-form">
          <input
            type="text"
            value={symbol}
            onChange={e => setSymbol(e.target.value.toUpperCase())}
            placeholder="Enter stock symbol (e.g. AAPL)"
            className="symbol-input"
          />
          <button type="submit" disabled={loading} className="search-button">
            {loading ? 'Loading...' : 'Get News'}
          </button>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}

      <div className="news-list">
        {loading ? (
          <div className="loading">Loading news...</div>
        ) : (
          <>
            {news.map((article, index) => (
              <div key={index} className="news-item">
                <div className="news-content">
                  <h3 className="news-title">
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                      {article.title}
                    </a>
                  </h3>
                  <p className="news-description">{article.description}</p>
                  <div className="news-meta">
                    <span className="news-source">{article.source?.name}</span>
                    <span className="news-date">
                      {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {article.urlToImage && (
                  <div className="news-image">
                    <img src={article.urlToImage} alt={article.title} />
                  </div>
                )}
              </div>
            ))}
            
            {!loading && news.length === 0 && !error && (
              <div className="empty-state">
                <h3>No news found</h3>
                <p>
                  {activeTab === 'stock' 
                    ? 'Try searching for a different stock symbol.' 
                    : 'Market news will appear here.'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
