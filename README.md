# Stock Predictor Platform

A professional-grade stock prediction platform built with React, featuring a Webull-inspired widget canvas system for creating custom trading models.

## 🚀 Features

### Trading Model Builder
- **Drag & Drop Widget Canvas**: Create custom trading dashboards with 11+ professional widgets
- **Edge-Based Resizing**: Intuitive widget resizing by dragging edges (no corner handles)
- **Real-time Preview**: Full-screen model preview with deployment-ready interface
- **Custom Naming**: Save models with personalized names

### Available Widgets
- **Quote Widgets**: Chart, Options, Quotes, Key Statistics, Time & Sales, Volume Analysis
- **Trade Widgets**: Order Book, NOII, Options Statistics, Warrant & CBBC, Brokers
- **Professional Styling**: Space-themed dark interface with Orbitron font

### Authentication System
- **Landing Page**: Professional login/signup flow
- **Password Security**: 8+ character requirement with capital letter validation
- **Terms & Conditions**: Built-in modal for user agreements

## 🛠 Tech Stack

- **Frontend**: React 19.1.1 with modern hooks
- **Build Tool**: Vite 7.1.5 for fast development
- **Styling**: Custom CSS with space theme (#232946, #eebbc3)
- **Planned Integrations**: 
  - TradingView JS API for live charts
  - Microsoft AI Toolkit (cloud services)
  - Supabase for backend data

## 🎯 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Usage

1. **Access Landing Page**: Login or create account
2. **Choose Template**: Select "Custom Model" from templates
3. **Build Model**: Drag widgets from library to canvas
4. **Customize Layout**: Resize widgets by dragging edges
5. **Save & Preview**: Name your model and view in full-screen
6. **Deploy**: Ready for production trading environment

## 🔧 Development

The platform uses a modular component architecture:
- `src/landing/` - Authentication components
- `src/templates/` - Model creation system
- `src/components/` - Reusable UI components

## 🚧 Roadmap

- [ ] TradingView chart integration
- [ ] Real-time data feeds
- [ ] AI-powered prediction algorithms
- [ ] Cloud deployment with Supabase
- [ ] Mobile responsive design
- [ ] Advanced widget customization

## 📄 License

This project is private and proprietary.
