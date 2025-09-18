# 🚀 AI-Powered Stock Prediction Platform

A comprehensive, enterprise-grade stock prediction platform with real-time data, AI analysis, and professional trading charts.

## ✨ Features

- **📊 Real-time Market Data** - Live quotes, charts, and market status
- **🤖 AI-Powered Analysis** - Cloud-based sentiment analysis and stock recommendations  
- **📈 Professional Charts** - TradingView Lightweight Charts with technical indicators
- **🔍 Smart Search** - Intelligent stock search across multiple exchanges
- **📰 News Integration** - Real-time financial news with sentiment scoring
- **🏛️ Enterprise APIs** - Yahoo Finance, Alpha Vantage, Polygon.io, News API
- **🔐 Secure Authentication** - Supabase-powered user management
- **📱 Responsive Design** - Mobile-optimized for all screen sizes

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
# Stock Data APIs
VITE_RAPIDAPI_KEY=your_rapidapi_key_here
VITE_ALPHA_VANTAGE_KEY=your_alpha_vantage_key_here
VITE_POLYGON_KEY=your_polygon_key_here

# News API
VITE_NEWS_API_KEY=your_news_api_key_here

# Cloud AI APIs
VITE_HUGGINGFACE_TOKEN=your_hf_token_here
VITE_GOOGLE_GEMINI_KEY=your_gemini_key_here

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

## 🎯 Features

### 📊 Dashboard
- Market overview with real-time gainers/losers
- Financial news feed with sentiment analysis
- Clickable stocks that auto-navigate to analysis

### 📈 Stock Analysis  
- Professional TradingView charts with technical indicators
- AI-powered analysis and recommendations
- Real-time data from multiple sources
- Smart stock search with autocomplete

### 🤖 AI Analysis
- **Cloud-Based:** No GPU required - pure cloud APIs
- **Sentiment Analysis:** FinBERT model via Hugging Face
- **Market Analysis:** Google Gemini AI recommendations

### 📰 News & History
- Real-time financial news aggregation
- Prediction history tracking
- Comprehensive settings management

## 🏗️ Technology Stack

- **Frontend:** React 18+ with Vite
- **Authentication:** Supabase  
- **Charts:** TradingView Lightweight Charts
- **APIs:** 6 different financial and AI services
- **Styling:** Modern CSS with dark theme

---

**⚠️ Security Reminder:** Keep your API keys safe! The `.env` file is gitignored and should never be committed.
