import axios from 'axios';

class NewsAPIService {
  constructor() {
    this.baseURL = 'https://newsapi.org/v2';
    this.apiKey = import.meta.env.VITE_NEWS_API_KEY;
    this.headers = {
      'X-API-Key': this.apiKey
    };
  }

  /**
   * Get business and financial news
   * @param {string} country - Country code (us, ca, gb, etc.)
   * @param {number} pageSize - Number of articles (max 100)
   * @returns {Promise<Object>} Business news articles
   */
  async getBusinessNews(country = 'us', pageSize = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/top-headlines`, {
        params: {
          category: 'business',
          country,
          pageSize,
          sortBy: 'publishedAt'
        },
        headers: this.headers
      });

      return this.formatNewsData(response.data);
    } catch (error) {
      console.error('News API business news error:', error);
      throw error;
    }
  }

  /**
   * Search for specific stock or company news
   * @param {string} query - Search query (company name, stock symbol)
   * @param {string} sortBy - Sort by: relevancy, popularity, publishedAt
   * @param {string} from - From date (YYYY-MM-DD)
   * @param {string} to - To date (YYYY-MM-DD)
   * @param {number} pageSize - Number of articles
   * @returns {Promise<Object>} Search results
   */
  async searchStockNews(query, sortBy = 'relevancy', from = null, to = null, pageSize = 20) {
    try {
      const params = {
        q: `${query} AND (stock OR shares OR trading OR market OR finance)`,
        sortBy,
        pageSize,
        language: 'en'
      };

      // Add date filters if provided
      if (from) params.from = from;
      if (to) params.to = to;

      const response = await axios.get(`${this.baseURL}/everything`, {
        params,
        headers: this.headers
      });

      return this.formatNewsData(response.data, query);
    } catch (error) {
      console.error('News API search error:', error);
      throw error;
    }
  }

  /**
   * Get market-related news from specific financial sources
   * @param {Array} sources - News sources (reuters, bloomberg, financial-times, etc.)
   * @param {number} pageSize - Number of articles
   * @returns {Promise<Object>} Market news from financial sources
   */
  async getMarketNews(sources = ['reuters', 'bloomberg', 'the-wall-street-journal'], pageSize = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/everything`, {
        params: {
          q: 'market OR stocks OR trading OR finance OR economy',
          sources: sources.join(','),
          sortBy: 'publishedAt',
          pageSize,
          language: 'en'
        },
        headers: this.headers
      });

      return this.formatNewsData(response.data, 'market');
    } catch (error) {
      console.error('News API market news error:', error);
      throw error;
    }
  }

  /**
   * Get cryptocurrency news
   * @param {number} pageSize - Number of articles
   * @returns {Promise<Object>} Crypto news articles
   */
  async getCryptoNews(pageSize = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/everything`, {
        params: {
          q: 'cryptocurrency OR bitcoin OR ethereum OR crypto OR blockchain',
          sortBy: 'publishedAt',
          pageSize,
          language: 'en'
        },
        headers: this.headers
      });

      return this.formatNewsData(response.data, 'crypto');
    } catch (error) {
      console.error('News API crypto news error:', error);
      throw error;
    }
  }

  /**
   * Get earnings and financial reports news
   * @param {string} timeframe - Time period ('today', 'week', 'month')
   * @param {number} pageSize - Number of articles
   * @returns {Promise<Object>} Earnings news
   */
  async getEarningsNews(timeframe = 'week', pageSize = 20) {
    try {
      let from = new Date();
      
      switch (timeframe) {
        case 'today':
          from.setDate(from.getDate() - 1);
          break;
        case 'week':
          from.setDate(from.getDate() - 7);
          break;
        case 'month':
          from.setDate(from.getDate() - 30);
          break;
      }

      const response = await axios.get(`${this.baseURL}/everything`, {
        params: {
          q: 'earnings OR "quarterly results" OR "financial results" OR revenue',
          from: from.toISOString().split('T')[0],
          sortBy: 'publishedAt',
          pageSize,
          language: 'en'
        },
        headers: this.headers
      });

      return this.formatNewsData(response.data, 'earnings');
    } catch (error) {
      console.error('News API earnings news error:', error);
      throw error;
    }
  }

  /**
   * Get news for multiple stock symbols
   * @param {Array} symbols - Array of stock symbols
   * @param {number} daysBack - Days to look back for news
   * @returns {Promise<Object>} News for all symbols
   */
  async getMultiStockNews(symbols, daysBack = 7) {
    try {
      const from = new Date();
      from.setDate(from.getDate() - daysBack);

      const query = symbols.map(symbol => `"${symbol}"`).join(' OR ');
      
      const response = await axios.get(`${this.baseURL}/everything`, {
        params: {
          q: `(${query}) AND (stock OR shares OR trading OR earnings)`,
          from: from.toISOString().split('T')[0],
          sortBy: 'relevancy',
          pageSize: 50,
          language: 'en'
        },
        headers: this.headers
      });

      return this.formatMultiStockNews(response.data, symbols);
    } catch (error) {
      console.error('News API multi-stock news error:', error);
      throw error;
    }
  }

  /**
   * Get trending financial topics
   * @returns {Promise<Object>} Trending topics in finance
   */
  async getTrendingTopics() {
    try {
      const topics = [
        'federal reserve',
        'interest rates',
        'inflation',
        'GDP',
        'unemployment',
        'oil prices',
        'tech stocks',
        'bank earnings'
      ];

      const promises = topics.map(async (topic) => {
        const response = await axios.get(`${this.baseURL}/everything`, {
          params: {
            q: topic,
            sortBy: 'popularity',
            pageSize: 5,
            language: 'en',
            from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          headers: this.headers
        });

        return {
          topic,
          articles: this.formatNewsData(response.data).articles.slice(0, 3),
          popularity: response.data.totalResults
        };
      });

      const results = await Promise.all(promises);
      
      return {
        trending: results.sort((a, b) => b.popularity - a.popularity),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('News API trending topics error:', error);
      throw error;
    }
  }

  // Data formatting methods
  formatNewsData(data, category = 'general') {
    if (!data.articles) {
      return { error: 'No articles found', data };
    }

    const articles = data.articles
      .filter(article => article.title && article.description) // Filter out incomplete articles
      .map(article => ({
        title: article.title,
        description: article.description,
        content: article.content,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        source: {
          id: article.source.id,
          name: article.source.name
        },
        author: article.author,
        category,
        sentiment: this.analyzeSentiment(article.title + ' ' + article.description),
        relevanceScore: this.calculateRelevance(article, category)
      }));

    return {
      status: data.status,
      totalResults: data.totalResults,
      articles,
      category,
      timestamp: new Date().toISOString()
    };
  }

  formatMultiStockNews(data, symbols) {
    const formattedData = this.formatNewsData(data, 'multi-stock');
    
    // Group articles by detected stock symbols
    const groupedNews = {};
    symbols.forEach(symbol => {
      groupedNews[symbol] = formattedData.articles.filter(article => 
        article.title.toUpperCase().includes(symbol.toUpperCase()) ||
        article.description.toUpperCase().includes(symbol.toUpperCase())
      );
    });

    return {
      ...formattedData,
      symbols,
      groupedBySymbol: groupedNews,
      summary: this.createNewsSummary(groupedNews)
    };
  }

  // Helper methods
  analyzeSentiment(text) {
    const positiveWords = ['gain', 'rise', 'up', 'growth', 'profit', 'beat', 'strong', 'positive', 'bull'];
    const negativeWords = ['fall', 'drop', 'down', 'loss', 'miss', 'weak', 'negative', 'bear', 'decline'];
    
    const textLower = text.toLowerCase();
    let score = 0;
    
    positiveWords.forEach(word => {
      if (textLower.includes(word)) score += 1;
    });
    
    negativeWords.forEach(word => {
      if (textLower.includes(word)) score -= 1;
    });
    
    if (score > 0) return 'positive';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  calculateRelevance(article, category) {
    let score = 0.5; // Base relevance
    
    const categoryKeywords = {
      'market': ['market', 'trading', 'stocks', 'index'],
      'earnings': ['earnings', 'revenue', 'profit', 'results'],
      'crypto': ['bitcoin', 'cryptocurrency', 'blockchain'],
      'general': ['finance', 'economy', 'business']
    };
    
    const keywords = categoryKeywords[category] || categoryKeywords.general;
    const text = (article.title + ' ' + article.description).toLowerCase();
    
    keywords.forEach(keyword => {
      if (text.includes(keyword)) score += 0.1;
    });
    
    return Math.min(1.0, score);
  }

  createNewsSummary(groupedNews) {
    const summary = {};
    
    Object.entries(groupedNews).forEach(([symbol, articles]) => {
      const sentiments = articles.map(article => article.sentiment);
      const positive = sentiments.filter(s => s === 'positive').length;
      const negative = sentiments.filter(s => s === 'negative').length;
      const neutral = sentiments.filter(s => s === 'neutral').length;
      
      summary[symbol] = {
        totalArticles: articles.length,
        sentiment: {
          positive,
          negative,
          neutral,
          overall: positive > negative ? 'positive' : negative > positive ? 'negative' : 'neutral'
        },
        recentArticles: articles.slice(0, 3)
      };
    });
    
    return summary;
  }

  /**
   * Health check for News API service
   */
  async healthCheck() {
    try {
      const response = await axios.get(`${this.baseURL}/top-headlines`, {
        params: {
          category: 'business',
          country: 'us',
          pageSize: 1
        },
        headers: this.headers
      });
      
      if (response.data.status === 'ok') {
        return { status: 'healthy', service: 'News API' };
      } else {
        return { status: 'error', message: response.data.message, service: 'News API' };
      }
    } catch (error) {
      if (error.response?.status === 429) {
        return { status: 'rate_limited', message: 'API rate limit exceeded', service: 'News API' };
      }
      return { status: 'error', message: error.message, service: 'News API' };
    }
  }
}

export default new NewsAPIService();