import { useState } from 'react';

const TradingChart = ({ symbol = 'AAPL', timeframe = '1D', height = 400 }) => {
  const [loading, setLoading] = useState(false);

  // Mock chart data for display
  const generateMockData = () => {
    const data = [];
    const basePrice = 150 + Math.random() * 100;
    
    for (let i = 0; i < 100; i++) {
      const price = basePrice + (Math.random() - 0.5) * 20;
      data.push({
        time: new Date(Date.now() - (100 - i) * 24 * 60 * 60 * 1000).toLocaleDateString(),
        price: price.toFixed(2)
      });
    }
    return data;
  };

  const mockData = generateMockData();
  const currentPrice = mockData[mockData.length - 1]?.price || '150.00';
  const previousPrice = mockData[mockData.length - 2]?.price || '150.00';
  const change = (currentPrice - previousPrice).toFixed(2);
  const changePercent = ((change / previousPrice) * 100).toFixed(2);
  const isPositive = change >= 0;

  return (
    <div style={{
      width: '100%',
      height: height,
      backgroundColor: '#1a1a1a',
      border: '1px solid #333',
      borderRadius: '8px',
      padding: '20px',
      position: 'relative'
    }}>
      {loading ? (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: '#999'
        }}>
          Loading chart data...
        </div>
      ) : (
        <>
          {/* Mock price display */}
          <div style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            zIndex: 10
          }}>
            <div style={{ color: '#fff', fontSize: '24px', fontWeight: 'bold' }}>
              ${currentPrice}
            </div>
            <div style={{
              color: isPositive ? '#4CAF50' : '#f44336',
              fontSize: '14px'
            }}>
              {isPositive ? '+' : ''}{change} ({isPositive ? '+' : ''}{changePercent}%)
            </div>
          </div>

          {/* Mock chart visualization */}
          <div style={{
            display: 'flex',
            alignItems: 'end',
            height: '80%',
            marginTop: '60px',
            gap: '2px',
            overflow: 'hidden'
          }}>
            {Array.from({ length: 50 }, (_, i) => {
              const barHeight = 20 + Math.random() * 60;
              const isGreen = Math.random() > 0.5;
              return (
                <div
                  key={i}
                  style={{
                    width: '4px',
                    height: `${barHeight}%`,
                    backgroundColor: isGreen ? '#4CAF50' : '#f44336',
                    opacity: 0.7,
                    borderRadius: '1px'
                  }}
                />
              );
            })}
          </div>

          {/* Chart info */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '20px',
            color: '#999',
            fontSize: '12px'
          }}>
            📈 {symbol} - {timeframe} | Mock Chart Data
          </div>

          {/* Real chart coming soon message */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            color: '#666',
            fontSize: '11px',
            fontStyle: 'italic'
          }}>
            TradingView integration pending
          </div>
        </>
      )}
    </div>
  );
};

export default TradingChart;