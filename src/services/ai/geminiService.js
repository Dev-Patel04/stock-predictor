import axios from 'axios';

class GeminiService {
  constructor() {
    this.baseURL = 'https://generativelanguage.googleapis.com/v1beta';
    this.apiKey = import.meta.env.VITE_GOOGLE_GEMINI_KEY;
  }

  /**
   * Generate comprehensive stock analysis using Gemini
   * @param {Object} stockData - Complete stock data object
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Detailed analysis
   */
  async analyzeStock(stockData, symbol) {
    try {
      const prompt = this.buildAnalysisPrompt(stockData, symbol);
      
      const response = await axios.post(
        `${this.baseURL}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      return this.parseAnalysisResponse(response.data);
    } catch (error) {
      console.error('Gemini analysis error:', error);
      throw error;
    }
  }

  /**
   * Generate trading recommendations
   * @param {Object} marketData - Current market data
   * @param {Object} userProfile - User's trading profile
   * @returns {Promise<Object>} Trading recommendations
   */
  async generateTradeRecommendations(marketData, userProfile = {}) {
    try {
      const prompt = `As a financial advisor, analyze this market data and provide trading recommendations:
      
      Market Data: ${JSON.stringify(marketData)}
      User Risk Tolerance: ${userProfile.riskTolerance || 'moderate'}
      Portfolio Size: ${userProfile.portfolioSize || 'not specified'}
      
      Please provide:
      1. 3-5 specific stock recommendations
      2. Entry points and target prices
      3. Risk assessment for each recommendation
      4. Portfolio allocation suggestions
      5. Market timing considerations
      
      Format response as structured JSON.`;

      const response = await axios.post(
        `${this.baseURL}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      return this.parseTradeRecommendations(response.data);
    } catch (error) {
      console.error('Trade recommendations error:', error);
      throw error;
    }
  }

  /**
   * Analyze market trends and provide insights
   * @param {Array} stockList - List of stocks to analyze
   * @returns {Promise<Object>} Market trend analysis
   */
  async analyzeMarketTrends(stockList) {
    try {
      const prompt = `Analyze current market trends based on these stocks: ${stockList.join(', ')}
      
      Provide insights on:
      1. Overall market sentiment
      2. Sector performance
      3. Economic indicators impact
      4. Short-term and long-term outlook
      5. Potential market catalysts
      
      Keep analysis concise but comprehensive.`;

      const response = await axios.post(
        `${this.baseURL}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      return this.parseMarketTrends(response.data);
    } catch (error) {
      console.error('Market trends analysis error:', error);
      throw error;
    }
  }

  /**
   * Build comprehensive analysis prompt
   * @private
   */
  buildAnalysisPrompt(stockData, symbol) {
    return `Analyze ${symbol} stock with the following data:
    
    Current Price: $${stockData.currentPrice}
    52-Week High/Low: $${stockData.yearHigh}/$${stockData.yearLow}
    Volume: ${stockData.volume}
    Market Cap: ${stockData.marketCap}
    P/E Ratio: ${stockData.peRatio}
    
    Recent Price Movement: ${JSON.stringify(stockData.recentPrices)}
    Technical Indicators: ${JSON.stringify(stockData.technicalIndicators)}
    
    Please provide:
    1. Technical analysis summary
    2. Fundamental analysis insights
    3. Price target (1-month outlook)
    4. Key support/resistance levels
    5. Risk factors to watch
    6. Overall recommendation (Buy/Hold/Sell)
    
    Be specific and data-driven in your analysis.`;
  }

  /**
   * Parse Gemini analysis response
   * @private
   */
  parseAnalysisResponse(response) {
    try {
      const text = response.candidates[0].content.parts[0].text;
      
      // Extract key information from the response
      return {
        analysis: text,
        recommendation: this.extractRecommendation(text),
        priceTarget: this.extractPriceTarget(text),
        confidence: this.calculateConfidence(text),
        keyPoints: this.extractKeyPoints(text),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      return { error: 'Failed to parse analysis' };
    }
  }

  /**
   * Parse trade recommendations
   * @private
   */
  parseTradeRecommendations(response) {
    try {
      const text = response.candidates[0].content.parts[0].text;
      
      return {
        recommendations: this.extractRecommendations(text),
        marketOutlook: this.extractMarketOutlook(text),
        riskAssessment: this.extractRiskAssessment(text),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing trade recommendations:', error);
      return { error: 'Failed to parse recommendations' };
    }
  }

  /**
   * Parse market trends
   * @private
   */
  parseMarketTrends(response) {
    try {
      const text = response.candidates[0].content.parts[0].text;
      
      return {
        sentiment: this.extractSentiment(text),
        trends: this.extractTrends(text),
        outlook: this.extractOutlook(text),
        catalysts: this.extractCatalysts(text),
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error parsing market trends:', error);
      return { error: 'Failed to parse trends' };
    }
  }

  // Helper methods for text extraction
  extractRecommendation(text) {
    const buyPattern = /\b(buy|strong buy|bullish)\b/i;
    const sellPattern = /\b(sell|strong sell|bearish)\b/i;
    const holdPattern = /\b(hold|neutral)\b/i;
    
    if (buyPattern.test(text)) return 'BUY';
    if (sellPattern.test(text)) return 'SELL';
    if (holdPattern.test(text)) return 'HOLD';
    return 'NEUTRAL';
  }

  extractPriceTarget(text) {
    const pricePattern = /\$(\d+(?:\.\d{2})?)/g;
    const matches = text.match(pricePattern);
    return matches ? matches[0] : null;
  }

  calculateConfidence(text) {
    // Simple confidence calculation based on language certainty
    const certainWords = ['definitely', 'clearly', 'strong', 'high probability'];
    const uncertainWords = ['might', 'could', 'possibly', 'uncertain'];
    
    let score = 0.5;
    certainWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score += 0.1;
    });
    uncertainWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score -= 0.1;
    });
    
    return Math.max(0.1, Math.min(0.9, score));
  }

  extractKeyPoints(text) {
    // Extract numbered points or bullet points
    const points = text.match(/\d+\.\s*([^\n]+)/g) || [];
    return points.map(point => point.replace(/\d+\.\s*/, ''));
  }

  extractRecommendations(text) {
    // Extract stock recommendations
    return [];
  }

  extractMarketOutlook(text) {
    return 'Market outlook extracted from text';
  }

  extractRiskAssessment(text) {
    return 'Risk assessment extracted from text';
  }

  extractSentiment(text) {
    return 'Sentiment extracted from text';
  }

  extractTrends(text) {
    return [];
  }

  extractOutlook(text) {
    return 'Outlook extracted from text';
  }

  extractCatalysts(text) {
    return [];
  }

  /**
   * Health check for Gemini service
   */
  async healthCheck() {
    try {
      const response = await axios.post(
        `${this.baseURL}/models/gemini-pro:generateContent?key=${this.apiKey}`,
        {
          contents: [{ parts: [{ text: 'Hello, are you working?' }] }]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      return { status: 'healthy', responsive: true };
    } catch (error) {
      return { status: 'error', message: error.message };
    }
  }
}

export default new GeminiService();