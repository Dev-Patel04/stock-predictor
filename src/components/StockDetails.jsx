import { useState, useEffect } from 'react';
import yahooFinanceService from '../services/stock/yahooFinanceService';
import alphaVantageService from '../services/stock/alphaVantageService';
import geminiService from '../services/ai/geminiService';
import huggingFaceService from '../services/ai/huggingFaceService';
import newsAPIService from '../services/news/newsAPIService';
import './StockDetails.css';

const StockDetails = ({ symbol }) => {
  const [stockData, setStockData] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (symbol) {
      loadStockDetails();
    }
  }, [symbol]);

  const loadStockDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load stock quote data
      const [quoteData, companyInfo] = await Promise.allSettled([
        yahooFinanceService.getQuote(symbol),
        alphaVantageService.getCompanyOverview(symbol)
      ]);

      if (quoteData.status === 'fulfilled') {
        setStockData(quoteData.value);
      }

      if (companyInfo.status === 'fulfilled') {
        setCompanyData(companyInfo.value);
      }

      // Load AI analysis and news in background
      loadAIAnalysis();
      loadNewsAndSentiment();

    } catch (error) {
      console.error('Error loading stock details:', error);
      setError('Failed to load stock details');
    } finally {
      setLoading(false);
    }
  };

  const loadAIAnalysis = async () => {
    try {
      const analysis = await geminiService.analyzeStock(symbol);
      setAiAnalysis(analysis);
    } catch (error) {
      console.error('AI analysis error:', error);
    }
  };

  const loadNewsAndSentiment = async () => {
    try {
      const [newsData, sentimentData] = await Promise.allSettled([
        newsAPIService.getStockNews(symbol),
        huggingFaceService.analyzeSentiment(`${symbol} stock analysis`)
      ]);

      if (newsData.status === 'fulfilled') {
        setNews(newsData.value.articles?.slice(0, 5) || []);
      }

      if (sentimentData.status === 'fulfilled') {
        setSentiment(sentimentData.value);
      }
    } catch (error) {
      console.error('News/sentiment error:', error);
    }
  };

  const formatPrice = (price) => {
    if (typeof price !== 'number') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatNumber = (num) => {
    if (typeof num !== 'number') return 'N/A';
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(2);
  };

  const formatPercent = (value) => {
    if (typeof value !== 'number') return 'N/A';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
  };

  const getChangeColor = (value) => {
    if (typeof value !== 'number') return '#888';
    return value >= 0 ? '#26a69a' : '#ef5350';
  };

  const getSentimentColor = (sentiment) => {
    if (!sentiment) return '#888';
    if (sentiment.label === 'POSITIVE') return '#26a69a';
    if (sentiment.label === 'NEGATIVE') return '#ef5350';
    return '#ff9800';
  };

  if (loading) {
    return (
      <div className="stock-details loading">
        <div className="loading-spinner">Loading stock details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-details error">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  if (!stockData && !companyData) {
    return (
      <div className="stock-details empty">
        <div className="empty-message">No data available for {symbol}</div>
      </div>
    );
  }

  return (
    <div className="stock-details">
      {/* Header with price and change */}
      <div className="stock-header">
        <div className="stock-title">
          <h2>{symbol}</h2>
          <p className="company-name">
            {companyData?.Name || stockData?.shortName || 'Company Name'}
          </p>
        </div>
        
        <div className="stock-price">
          <div className="current-price">
            {formatPrice(stockData?.regularMarketPrice || stockData?.price)}
          </div>
          <div 
            className="price-change"
            style={{ color: getChangeColor(stockData?.regularMarketChange) }}
          >
            {formatPrice(stockData?.regularMarketChange)} 
            ({formatPercent(stockData?.regularMarketChangePercent)})
          </div>
        </div>
      </div>

      {/* Key metrics */}
      <div className="metrics-grid">
        <div className="metric-item">
          <label>Market Cap</label>
          <value>{formatNumber(stockData?.marketCap || companyData?.MarketCapitalization)}</value>
        </div>
        <div className="metric-item">
          <label>P/E Ratio</label>
          <value>{companyData?.PERatio || stockData?.trailingPE || 'N/A'}</value>
        </div>
        <div className="metric-item">
          <label>52W High</label>
          <value>{formatPrice(stockData?.fiftyTwoWeekHigh)}</value>
        </div>
        <div className="metric-item">
          <label>52W Low</label>
          <value>{formatPrice(stockData?.fiftyTwoWeekLow)}</value>
        </div>
        <div className="metric-item">
          <label>Volume</label>
          <value>{formatNumber(stockData?.regularMarketVolume)}</value>
        </div>
        <div className="metric-item">
          <label>Avg Volume</label>
          <value>{formatNumber(stockData?.averageVolume)}</value>
        </div>
      </div>

      {/* AI Analysis */}
      {aiAnalysis && (
        <div className="ai-analysis">
          <h3>AI Analysis</h3>
          <div className="analysis-content">
            <div className="recommendation">
              <span className="rec-label">Recommendation:</span>
              <span className={`rec-value ${aiAnalysis.recommendation?.toLowerCase()}`}>
                {aiAnalysis.recommendation}
              </span>
            </div>
            <div className="analysis-summary">
              {aiAnalysis.summary}
            </div>
            {aiAnalysis.keyPoints && (
              <ul className="key-points">
                {aiAnalysis.keyPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Sentiment Analysis */}
      {sentiment && (
        <div className="sentiment-analysis">
          <h3>Market Sentiment</h3>
          <div className="sentiment-indicator">
            <span 
              className="sentiment-label"
              style={{ color: getSentimentColor(sentiment) }}
            >
              {sentiment.label}
            </span>
            <span className="sentiment-score">
              Confidence: {(sentiment.score * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      )}

      {/* Company Info */}
      {companyData && (
        <div className="company-info">
          <h3>Company Overview</h3>
          <div className="company-details">
            <div className="company-row">
              <span>Sector:</span>
              <span>{companyData.Sector || 'N/A'}</span>
            </div>
            <div className="company-row">
              <span>Industry:</span>
              <span>{companyData.Industry || 'N/A'}</span>
            </div>
            <div className="company-row">
              <span>Employees:</span>
              <span>{formatNumber(companyData.FullTimeEmployees)}</span>
            </div>
            <div className="company-row">
              <span>Dividend Yield:</span>
              <span>{companyData.DividendYield ? `${(companyData.DividendYield * 100).toFixed(2)}%` : 'N/A'}</span>
            </div>
          </div>
          {companyData.Description && (
            <div className="company-description">
              <h4>About</h4>
              <p>{companyData.Description}</p>
            </div>
          )}
        </div>
      )}

      {/* Recent News */}
      {news.length > 0 && (
        <div className="recent-news">
          <h3>Recent News</h3>
          <div className="news-list">
            {news.map((article, index) => (
              <div key={index} className="news-item">
                <div className="news-title">
                  <a href={article.url} target="_blank" rel="noopener noreferrer">
                    {article.title}
                  </a>
                </div>
                <div className="news-meta">
                  <span className="news-source">{article.source?.name}</span>
                  <span className="news-date">
                    {new Date(article.publishedAt).toLocaleDateString()}
                  </span>
                </div>
                {article.description && (
                  <div className="news-description">
                    {article.description.substring(0, 120)}...
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StockDetails;