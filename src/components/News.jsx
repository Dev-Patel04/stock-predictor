import React, { useState } from 'react';


const API_KEY = 'ZItf9DENIEskrZIu5wXs30i7edUAcwPAM2Gnu1hD';

export default function News() {
  const [symbol, setSymbol] = useState('AAPL');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://api.marketaux.com/v1/news/all?symbols=${symbol}&filter_entities=true&language=en&api_token=${API_KEY}`);
      const data = await res.json();
      if (data.data) {
        setNews(data.data);
      } else {
        setNews([]);
        setError('No news found.');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to fetch news.');
      setNews([]);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Stock News</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={symbol}
          onChange={e => setSymbol(e.target.value.toUpperCase())}
          placeholder="Enter stock symbol (e.g. AAPL)"
          style={{ marginRight: '0.5rem', padding: '0.3rem' }}
        />
        <button onClick={fetchNews} disabled={loading} style={{ padding: '0.3rem 0.7rem' }}>
          {loading ? 'Loading...' : 'Get News'}
        </button>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {news.map(article => (
          <li key={article.uuid} style={{ marginBottom: '1.2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
            <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold', fontSize: '1.1rem', color: '#2a5bd7' }}>{article.title}</a>
            <div style={{ fontSize: '0.9rem', color: '#555', margin: '0.3rem 0' }}>{article.published_at ? new Date(article.published_at).toLocaleString() : ''}</div>
            <div style={{ fontSize: '0.95rem' }}>{article.description}</div>
          </li>
        ))}
      </ul>
      {!loading && news.length === 0 && !error && <p>Latest news about the selected stock will appear here.</p>}
    </div>
  );
}
