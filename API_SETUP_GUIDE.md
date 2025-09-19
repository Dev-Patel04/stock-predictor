# 🔑 API Keys Setup Guide for Stock Predictor

## Required API Keys (Free tiers available):

### 1. Google Gemini API (Most Important for AI)
- Go to: https://makersuite.google.com/app/apikey
- Sign in with Google account
- Click "Create API Key"
- Copy the key and use for VITE_GOOGLE_GEMINI_KEY

### 2. HuggingFace Token (For Financial AI Models)
- Go to: https://huggingface.co/settings/tokens
- Sign up/login to HuggingFace
- Click "New token" 
- Copy the token and use for VITE_HUGGINGFACE_TOKEN

### 3. RapidAPI Key (For Yahoo Finance Data)
- Go to: https://rapidapi.com/apidojo/api/yahoo-finance1/
- Sign up for free account
- Subscribe to Yahoo Finance API (free tier)
- Copy X-RapidAPI-Key and use for VITE_RAPIDAPI_KEY

### 4. News API Key (For Financial News)
- Go to: https://newsapi.org/register
- Register for free account
- Copy API key and use for VITE_NEWS_API_KEY

### 5. Alpha Vantage (Alternative Stock Data)
- Go to: https://www.alphavantage.co/support/#api-key
- Get free API key
- Use for VITE_ALPHA_VANTAGE_KEY

## Quick Setup (All Free):
1. Get Gemini key (5 minutes) - Most important for AI
2. Get HuggingFace token (2 minutes) - For sentiment analysis
3. Get RapidAPI key (5 minutes) - For stock data
4. Get News API key (3 minutes) - For news feed

Total time: ~15 minutes for full setup

## Priority Order:
1. VITE_GOOGLE_GEMINI_KEY (Essential for AI analysis)
2. VITE_RAPIDAPI_KEY (Essential for stock data)
3. VITE_HUGGINGFACE_TOKEN (Enhances AI with sentiment)
4. VITE_NEWS_API_KEY (Adds news integration)

Once you get these, just replace the placeholder values in .env file!