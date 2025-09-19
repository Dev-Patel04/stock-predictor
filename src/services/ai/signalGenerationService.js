import GeminiService from './geminiService.js';
import HuggingFaceService from './huggingFaceService.js';

class SignalGenerationService {
  constructor() {
    this.geminiService = new GeminiService();
    this.huggingFaceService = new HuggingFaceService();
  }

  /**
   * Generate trading signals based on user model or preset model
   * @param {Object} modelConfig - Model configuration (widgets, rules, etc.)
   * @param {Object} stockData - Current stock data
   * @param {string} symbol - Stock symbol
   * @returns {Promise<Object>} Trading signals and analysis
   */
  async generateSignals(modelConfig, stockData, symbol) {
    try {
      console.log('Generating signals for', symbol, 'with model:', modelConfig);

      // Determine if using preset model or custom model
      const isPresetModel = modelConfig.isPreset;
      
      let signals;
      if (isPresetModel) {
        signals = await this.generatePresetModelSignals(modelConfig, stockData, symbol);
      } else {
        signals = await this.generateCustomModelSignals(modelConfig, stockData, symbol);
      }

      return {
        success: true,
        signals,
        timestamp: new Date().toISOString(),
        model: modelConfig.name,
        symbol
      };

    } catch (error) {
      console.error('Error generating signals:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  /**
   * Generate signals using preset models (LSTM, Random Forest, GRU)
   */
  async generatePresetModelSignals(modelConfig, stockData, symbol) {
    const { name, id } = modelConfig;

    // Create prompts specific to each preset model
    let analysisPrompt = '';
    
    switch (id) {
      case 1: // LSTM Basic
        analysisPrompt = `
          As an LSTM (Long Short-Term Memory) neural network model for stock prediction, analyze ${symbol} and provide:
          
          Current Stock Data: ${JSON.stringify(stockData, null, 2)}
          
          Based on LSTM time-series analysis (1-7 day prediction window):
          1. Price prediction for next 1-7 days
          2. Trend direction (bullish/bearish/neutral)
          3. Confidence level (0-100%)
          4. Key technical patterns identified
          5. Support/resistance levels
          6. Trading signals (BUY/SELL/HOLD)
          
          Format as JSON with clear signals and reasoning.
        `;
        break;
        
      case 2: // Random Forest
        analysisPrompt = `
          As a Random Forest ensemble learning model for market trend analysis, analyze ${symbol}:
          
          Current Stock Data: ${JSON.stringify(stockData, null, 2)}
          
          Using Random Forest decision tree analysis (1-30 day prediction):
          1. Market trend probability analysis
          2. Feature importance ranking (volume, price, indicators)
          3. Risk assessment
          4. Volatility prediction
          5. Entry/exit points
          6. Trading signals with confidence intervals
          
          Provide ensemble predictions with statistical confidence.
        `;
        break;
        
      case 3: // GRU Advanced
        analysisPrompt = `
          As an advanced GRU (Gated Recurrent Unit) model with technical indicators, analyze ${symbol}:
          
          Current Stock Data: ${JSON.stringify(stockData, null, 2)}
          
          Advanced GRU analysis with technical indicators (1-14 day window):
          1. Sequential pattern analysis
          2. Technical indicator integration (RSI, MACD, Bollinger Bands)
          3. Momentum analysis
          4. Volume-price relationship
          5. Market microstructure signals
          6. Multi-timeframe analysis
          7. Advanced trading signals
          
          Provide sophisticated predictions with technical justification.
        `;
        break;
        
      default:
        analysisPrompt = `Analyze ${symbol} using general market analysis principles.`;
    }

    // Get AI analysis
    const aiAnalysis = await this.geminiService.generateStockPrediction(analysisPrompt, stockData, symbol);
    
    // Add preset model specific formatting
    return {
      type: 'preset',
      modelName: name,
      modelId: id,
      analysis: aiAnalysis,
      signals: this.extractSignalsFromAnalysis(aiAnalysis),
      confidence: this.calculateModelConfidence(id, aiAnalysis),
      timeframe: this.getModelTimeframe(id)
    };
  }

  /**
   * Generate signals using custom widget-based models
   */
  async generateCustomModelSignals(modelConfig, stockData, symbol) {
    const { widgets, name } = modelConfig;

    // Analyze widgets to determine prediction focus
    const widgetAnalysis = this.analyzeWidgets(widgets);
    
    const customPrompt = `
      As a custom trading model "${name}" for ${symbol}, analyze based on selected widgets:
      
      Selected Widgets: ${widgetAnalysis.widgetTypes.join(', ')}
      Focus Areas: ${widgetAnalysis.focusAreas.join(', ')}
      
      Current Stock Data: ${JSON.stringify(stockData, null, 2)}
      
      Custom Model Analysis:
      1. Widget-specific insights (${widgetAnalysis.widgetTypes.join(', ')})
      2. Combined signal analysis
      3. Risk assessment based on selected indicators
      4. Trading recommendations
      5. Custom model confidence score
      
      Provide analysis tailored to the selected widget combination.
    `;

    const aiAnalysis = await this.geminiService.generateStockPrediction(customPrompt, stockData, symbol);
    
    return {
      type: 'custom',
      modelName: name,
      widgets: widgets.length,
      widgetTypes: widgetAnalysis.widgetTypes,
      analysis: aiAnalysis,
      signals: this.extractSignalsFromAnalysis(aiAnalysis),
      confidence: this.calculateCustomModelConfidence(widgetAnalysis, aiAnalysis)
    };
  }

  /**
   * Analyze widgets to understand model focus
   */
  analyzeWidgets(widgets) {
    const widgetTypes = widgets.map(w => w.name);
    const focusAreas = [];

    // Determine focus based on widgets
    if (widgets.some(w => w.id.includes('chart'))) focusAreas.push('Technical Analysis');
    if (widgets.some(w => w.id.includes('volume'))) focusAreas.push('Volume Analysis');
    if (widgets.some(w => w.id.includes('options'))) focusAreas.push('Options Flow');
    if (widgets.some(w => w.id.includes('order-book'))) focusAreas.push('Market Depth');
    if (widgets.some(w => w.id.includes('time-sales'))) focusAreas.push('Transaction Analysis');
    if (widgets.some(w => w.id.includes('stats'))) focusAreas.push('Statistical Analysis');

    return {
      widgetTypes,
      focusAreas,
      complexity: widgets.length > 5 ? 'high' : widgets.length > 2 ? 'medium' : 'low'
    };
  }

  /**
   * Extract actionable signals from AI analysis
   */
  extractSignalsFromAnalysis(analysis) {
    // This would parse the AI response and extract structured signals
    // For now, return a structured format
    return {
      action: 'HOLD', // BUY, SELL, HOLD
      strength: 'MEDIUM', // WEAK, MEDIUM, STRONG
      priceTarget: null,
      stopLoss: null,
      timeHorizon: '1-7 days',
      reasoning: 'AI analysis pending implementation'
    };
  }

  /**
   * Calculate confidence based on model type
   */
  calculateModelConfidence(modelId, analysis) {
    // Different models have different base confidence levels
    const baseConfidence = {
      1: 0.78, // LSTM Basic
      2: 0.82, // Random Forest
      3: 0.85  // GRU Advanced
    };

    return baseConfidence[modelId] || 0.75;
  }

  /**
   * Get model prediction timeframe
   */
  getModelTimeframe(modelId) {
    const timeframes = {
      1: '1-7 days',    // LSTM Basic
      2: '1-30 days',   // Random Forest
      3: '1-14 days'    // GRU Advanced
    };

    return timeframes[modelId] || '1-7 days';
  }

  /**
   * Calculate confidence for custom models
   */
  calculateCustomModelConfidence(widgetAnalysis, analysis) {
    // Base confidence on widget complexity and coverage
    let confidence = 0.70; // Base confidence

    // Adjust based on widget complexity
    if (widgetAnalysis.complexity === 'high') confidence += 0.10;
    if (widgetAnalysis.complexity === 'medium') confidence += 0.05;

    // Adjust based on focus areas
    if (widgetAnalysis.focusAreas.length > 2) confidence += 0.05;

    return Math.min(0.95, confidence); // Cap at 95%
  }

  /**
   * Generate signals for real-time monitoring
   */
  async generateRealtimeSignals(modelConfig, symbol) {
    try {
      // This would fetch real-time data and generate signals
      console.log('Generating real-time signals for', symbol);
      
      return {
        symbol,
        timestamp: new Date().toISOString(),
        signals: {
          action: 'MONITOR',
          alert: 'Real-time monitoring active',
          nextUpdate: new Date(Date.now() + 60000).toISOString() // 1 minute
        }
      };
    } catch (error) {
      console.error('Error generating real-time signals:', error);
      throw error;
    }
  }
}

export default new SignalGenerationService();