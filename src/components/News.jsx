import React, { useState, useEffect } from 'react';
import newsAPIService from '../services/news/newsAPIService';
import './News.css';

export default function News() {
  const [symbol, setSymbol] = useState('AAPL');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('market');
  const [lastUpdated, setLastUpdated] = useState(null);

  console.log('News component mounted');

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
      console.log('Fetching stock news for:', symbol);
      const data = await newsAPIService.getStockNews(symbol);
      setNews(data.articles || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching stock news:', err);
      setError('Failed to fetch news. Please try again.');
      // Show fallback news data
      setNews([
        {
          title: `${symbol} Stock Analysis - Latest Updates`,
          description: `Recent developments and market analysis for ${symbol} stock. Check official sources for real-time updates.`,
          url: '#',
          source: { name: 'Stock Analysis' },
          publishedAt: new Date().toISOString(),
          urlToImage: null
        }
      ]);
    }
    setLoading(false);
  };

  const fetchMarketNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Fetching market news');
      const data = await newsAPIService.getBusinessNews();
      setNews(data.articles || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching market news:', err);
      setError('Failed to fetch market news. Please try again.');
      // Show fallback market news
      setNews([
        {
          title: "Markets Show Strong Performance Amid Tech Rally",
          description: "Major stock indices continue to climb as technology stocks lead the way with strong earnings reports and positive market sentiment.",
          url: '#',
          source: { name: 'Market Watch' },
          publishedAt: new Date().toISOString(),
          urlToImage: null
        },
        {
          title: "Federal Reserve Maintains Steady Interest Rate Policy",
          description: "The Federal Reserve announced it will maintain current interest rates, providing stability to financial markets and supporting economic growth.",
          url: '#',
          source: { name: 'Financial Times' },
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          urlToImage: null
        },
        {
          title: "AI and Technology Stocks Drive Market Innovation",
          description: "Artificial intelligence and technology companies continue to attract investor attention with breakthrough innovations and strong revenue growth.",
          url: '#',
          source: { name: 'Reuters' },
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          urlToImage: null
        }
      ]);
    }
    setLoading(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
  };

  const handleSymbolSubmit = (e) => {
    e.preventDefault();
    if (symbol.trim()) {
      fetchStockNews();
    }
  };

  const refreshNews = () => {
    if (activeTab === 'market') {
      fetchMarketNews();
    } else {
      fetchStockNews();
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInHours = Math.floor((now - publishedDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours === 1) {
      return '1 hour ago';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
  };

  return (
    <div className="news">
      <div className="news-header">
        <h2>📰 Market News</h2>
        <p>Stay updated with the latest market news and stock-specific information</p>
        
        <div className="news-controls">
          <div className="tab-selector">
            <button
              className={`tab-btn ${activeTab === 'market' ? 'active' : ''}`}
              onClick={() => handleTabChange('market')}
            >
              🌐 Market News
            </button>
            <button
              className={`tab-btn ${activeTab === 'stock' ? 'active' : ''}`}
              onClick={() => handleTabChange('stock')}
            >
              📈 Stock News
            </button>
          </div>
          
          <button className="refresh-btn" onClick={refreshNews} disabled={loading}>
            {loading ? '🔄' : '↻'} Refresh
          </button>
        </div>
      </div>

      {activeTab === 'stock' && (
        <div className="stock-search-section">
          <form onSubmit={handleSymbolSubmit} className="symbol-form">
            <input
              type="text"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="Enter stock symbol (e.g., AAPL, TSLA, MSFT)"
              className="symbol-input"
            />
            <button type="submit" className="search-btn" disabled={loading}>
              Search News
            </button>
          </form>
        </div>
      )}

      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={refreshNews} className="retry-btn">
            Try Again
          </button>
        </div>
      )}

      {lastUpdated && (
        <div className="last-updated">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      )}

      <div className="news-content">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading news...</p>
          </div>
        ) : (
          <div className="news-grid">
            {news.length > 0 ? (
              news.slice(0, 12).map((article, index) => (
                <div key={index} className="news-card">
                  {article.urlToImage && (
                    <div className="news-image">
                      <img 
                        src={article.urlToImage} 
                        alt={article.title}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <div className="news-content-text">
                    <h3 className="news-title">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                      >
                        {article.title}
                      </a>
                    </h3>
                    <p className="news-description">
                      {article.description?.substring(0, 150)}
                      {article.description?.length > 150 ? '...' : ''}
                    </p>
                    <div className="news-meta">
                      <span className="news-source">
                        {article.source?.name || 'Unknown Source'}
                      </span>
                      <span className="news-time">
                        {formatTimeAgo(article.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-state">
                <h3>No news available</h3>
                <p>
                  {activeTab === 'market' 
                    ? 'Unable to load market news at this time.' 
                    : `No news found for ${symbol}. Try a different symbol.`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}