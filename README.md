# 🚀 Professional Stock Trading Platform

A comprehensive, en## 🔐 API Setup

### Required APIs (Get your free keys here):

#### **Core Trading APIs (Required)**
1. **Finnhub API** - [finnhub.io](https://finnhub.io/) 
   - **Purpose:** Real-time stock quotes and market data
   - **Free Tier:** 60 API calls/minute, perfect for real-time quotes
   - **Usage:** Powers live stock prices and market status

2. **Twelve Data API** - [twelvedata.com](https://twelvedata.com/)
   - **Purpose:** Historical OHLCV data for professional charts
   - **Free Tier:** 800 API calls/day (optimized with our caching system)
   - **Usage:** Powers candlestick charts and historical analysis

#### **Optional Enhancement APIs**
3. **News API** - [newsapi.org](https://newsapi.org/)
   - **Purpose:** Financial news and market updates
   - **Free Tier:** 1000 requests/day

4. **Google Gemini AI** - [aistudio.google.com](https://aistudio.google.com/)
   - **Purpose:** AI-powered stock analysis and recommendations
   - **Free Tier:** Generous monthly quota

5. **Hugging Face** - [huggingface.co](https://huggingface.co/settings/tokens)
   - **Purpose:** Sentiment analysis of financial news
   - **Free Tier:** Available for most modelsade stock trading platform with real-time data, professional TradingView-style charts, and AI-powered analysis.

## ✨ Features

- **📊 Real-time Market Data** - Live quotes from Finnhub API with millisecond updates
- **🕯️ Professional Candlestick Charts** - TradingView-style charts with Recharts implementation
- **📈 Historical Data Analysis** - Multi-timeframe charts (1D, 5D, 1M, 3M, 6M, 1Y) via Twelve Data
- **🎯 Smart Credit Management** - Intelligent API caching system to optimize usage
- **🔍 Professional Search** - Real-time stock search with symbol validation
- **📰 Financial News Integration** - Real-time news with sentiment analysis
- **🤖 AI-Powered Insights** - Cloud-based stock analysis and recommendations
- **� Professional UI** - Dark theme matching real trading platforms
- **📱 Responsive Design** - Optimized for desktop and mobile trading

## 🔐 Security Setup (IMPORTANT!)

### Environment Variables Security
This project uses environment variables for API keys. **NEVER commit your `.env` file with real API keys!**

**✅ Correct Setup:**
1. Copy `.env.example` to `.env`
2. Fill in your real API keys in `.env`
3. The `.env` file is already in `.gitignore` and won't be committed
4. Only `.env.example` (with dummy values) should be committed to Git

**❌ Wrong Setup:**
- Never put real API keys in `.env.example`
- Never commit `.env` file to Git
- Never share API keys in code or commits

## � Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed  
- API keys for various services (see setup below)

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/Dev-Patel04/stock-predictor.git
   cd stock-predictor
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   # Then edit .env with your real API keys
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## � API Setup

### Required APIs (Get your free keys here):

1. **Yahoo Finance API** - [RapidAPI](https://rapidapi.com/apidojo/api/yahoo-finance1/)
2. **Alpha Vantage API** - [alphavantage.co](https://www.alphavantage.co/support/#api-key)  
3. **Polygon.io API** - [polygon.io](https://polygon.io/)
4. **News API** - [newsapi.org](https://newsapi.org/)
5. **Google Gemini AI** - [aistudio.google.com](https://aistudio.google.com/)
6. **Hugging Face** - [huggingface.co](https://huggingface.co/settings/tokens)
7. **Supabase** - [supabase.com](https://supabase.com/)

### .env Configuration
```bash
# Core Trading APIs (Required)
VITE_FINNHUB_KEY=your_finnhub_api_key_here
VITE_TWELVE_DATA_KEY=your_twelve_data_api_key_here

# Optional Enhancement APIs
VITE_NEWS_API_KEY=your_news_api_key_here
VITE_GOOGLE_GEMINI_KEY=your_gemini_key_here
VITE_HUGGINGFACE_TOKEN=your_hf_token_here

# Optional: Authentication & Database
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

### 💰 **Cost Optimization**
Our platform includes smart features to minimize API costs:
- **5-minute caching** for Twelve Data to reduce historical data calls
- **Request tracking** to monitor daily usage limits  
- **Background preloading** for instant timeframe switching
- **Error fallbacks** to gracefully handle API limits

### 🚀 **Quick Setup Guide**
1. **Get Finnhub API key** (Required) - Sign up at [finnhub.io](https://finnhub.io/)
2. **Get Twelve Data API key** (Required) - Sign up at [twelvedata.com](https://twelvedata.com/)
3. **Copy `.env.example` to `.env`** and add your API keys
4. **Run `npm install`** and **`npm run dev`**
5. **Start trading!** 🎯

### 🎖️ **What Makes This Special**
- ✅ **Professional-grade** candlestick charts that rival TradingView
- ✅ **Real-time data** updates without page refreshes
- ✅ **Smart caching** system saves money on API calls
- ✅ **Mobile-responsive** design works on any device
- ✅ **Zero setup complexity** - just add API keys and go!
- ✅ **Enterprise-quality** error handling and fallbacks

## 🎯 Features

### 📊 Professional Trading Dashboard
- **Real-time market overview** with live gainers/losers from Finnhub
- **Interactive stock cards** with instant navigation to detailed analysis
- **Live market status** and trading session information
- **Professional dark theme** matching real trading platforms

### 📈 Advanced Stock Analysis  
- **TradingView-style candlestick charts** with professional OHLCV visualization
- **Multi-timeframe analysis** (1D, 5D, 1M, 3M, 6M, 1Y) with instant switching
- **Professional tooltips** showing complete trading data (Open, High, Low, Close, Volume, Change%)
- **Real-time price updates** with live quotes from Finnhub
- **Smart stock search** with symbol validation and autocomplete

### 🕯️ Professional Charts
- **Candlestick visualization** with proper wicks, bodies, and color coding
- **TradingView-inspired design** with right-side price axis and clean grid
- **Optimized data density** for clear pattern recognition
- **Responsive design** that works on all screen sizes
- **Professional color scheme** (green/red) matching trading platforms

### 🤖 AI-Powered Analysis (Optional)
- **Cloud-based processing** - No GPU required, pure cloud APIs
- **Sentiment analysis** via Hugging Face FinBERT models
- **Market recommendations** using Google Gemini AI
- **News sentiment scoring** for market insights

### � Smart Technology
- **Intelligent caching** system to minimize API costs (5-minute cache)
- **Credit tracking** to monitor daily API usage limits
- **Background preloading** for instant timeframe switching
- **Graceful error handling** with fallback systems
- **Memory-efficient** rendering for smooth performance

## 🏗️ Technology Stack

### **Core Technologies**
- **Frontend:** React 18+ with Vite for lightning-fast development
- **Charts:** Recharts with custom TradingView-style candlestick implementation
- **State Management:** React Hooks (useState, useEffect, useRef)
- **Styling:** Modern CSS with professional dark theme

### **API Integrations**
- **Real-time Data:** Finnhub API for live stock quotes and market data
- **Historical Data:** Twelve Data API for OHLCV candlestick charts
- **News:** News API for financial news aggregation
- **AI Analysis:** Google Gemini AI and Hugging Face for intelligent insights

### **Performance Optimizations**
- **Smart Caching:** 5-minute cache system to optimize API usage
- **Request Tracking:** Monitor and manage daily API limits
- **Background Preloading:** Instant timeframe switching
- **Memory Management:** Efficient chart rendering and cleanup

### **Development Features**
- **Hot Module Replacement:** Instant updates during development
- **Proxy Configuration:** CORS handling for API calls
- **Environment Variables:** Secure API key management
- **Modern Build Tools:** Vite for optimal performance

---

**⚠️ Security Reminder:** Keep your API keys safe! The `.env` file is gitignored and should never be committed.
