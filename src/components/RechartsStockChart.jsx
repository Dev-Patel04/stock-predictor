import React from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const RechartsStockChart = ({ data, symbol, timeframe, loading }) => {
  if (loading) {
    return (
      <div style={{ 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        color: '#9db2bd',
        border: '1px solid #2a2a2a'
      }}>
        <div>📊 Loading professional chart data...</div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{ 
        height: '400px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#1e1e1e',
        borderRadius: '8px',
        color: '#9db2bd',
        border: '1px solid #2a2a2a'
      }}>
        <div>No chart data available</div>
      </div>
    );
  }

  // Format time for cleaner display
  const formatTime = (time) => {
    if (typeof time === 'string') {
      const date = new Date(time);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      const date = new Date(time * 1000);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Sample data for cleaner display (reduce density like TradingView)
  const sampledData = data.filter((_, index) => index % 2 === 0 || index === data.length - 1);
  
  const chartData = sampledData.map((item, index) => {
    const isPositive = item.close >= item.open;
    
    return {
      index: index,
      time: formatTime(item.time),
      open: item.open,
      high: item.high,
      low: item.low,
      close: item.close,
      volume: item.volume,
      isPositive: isPositive,
      color: isPositive ? '#00c896' : '#ff5252'
    };
  });

  // TradingView-style candlestick component
  const TradingViewCandle = ({ payload, x, y, width, height }) => {
    if (!payload || !payload.open) return null;

    const { open, high, low, close, isPositive, color } = payload;
    
    // Clean TradingView-style proportions
    const candleWidth = Math.min(width * 0.7, 8); // Max 8px width for professional look
    const wickWidth = 1;
    const centerX = x + width / 2;
    
    // Calculate data range for positioning
    const dataMin = Math.min(...chartData.map(d => d.low));
    const dataMax = Math.max(...chartData.map(d => d.high));
    const priceRange = dataMax - dataMin;
    
    if (priceRange === 0) return null;
    
    // Calculate exact pixel positions
    const highY = y + ((dataMax - high) / priceRange) * height;
    const lowY = y + ((dataMax - low) / priceRange) * height;
    const openY = y + ((dataMax - open) / priceRange) * height;
    const closeY = y + ((dataMax - close) / priceRange) * height;
    
    const bodyTop = Math.min(openY, closeY);
    const bodyBottom = Math.max(openY, closeY);
    const bodyHeight = Math.max(bodyBottom - bodyTop, 1);
    
    return (
      <g>
        {/* Upper wick */}
        <line
          x1={centerX}
          y1={highY}
          x2={centerX}
          y2={bodyTop}
          stroke={color}
          strokeWidth={wickWidth}
          strokeLinecap="round"
        />
        
        {/* Lower wick */}
        <line
          x1={centerX}
          y1={bodyBottom}
          x2={centerX}
          y2={lowY}
          stroke={color}
          strokeWidth={wickWidth}
          strokeLinecap="round"
        />
        
        {/* Candlestick body - TradingView style */}
        <rect
          x={centerX - candleWidth / 2}
          y={bodyTop}
          width={candleWidth}
          height={bodyHeight}
          fill={isPositive ? color : '#1e1e1e'}
          stroke={color}
          strokeWidth={1}
          rx={0.5}
        />
      </g>
    );
  };

  // Professional TradingView-style tooltip
  const TradingViewTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const change = data.close - data.open;
      const changePercent = ((change / data.open) * 100);
      
      return (
        <div style={{
          backgroundColor: 'rgba(25, 30, 35, 0.95)',
          border: '1px solid #383838',
          borderRadius: '6px',
          padding: '12px',
          color: '#d1d4dc',
          fontSize: '13px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          minWidth: '200px'
        }}>
          <div style={{ 
            fontWeight: '600', 
            marginBottom: '8px', 
            color: '#fff',
            borderBottom: '1px solid #383838',
            paddingBottom: '6px'
          }}>
            {symbol} • {label}
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '12px' }}>
            <div style={{ color: '#9db2bd' }}>Open:</div>
            <div style={{ color: '#fff', textAlign: 'right' }}>${data.open?.toFixed(2)}</div>
            
            <div style={{ color: '#9db2bd' }}>High:</div>
            <div style={{ color: '#00c896', textAlign: 'right' }}>${data.high?.toFixed(2)}</div>
            
            <div style={{ color: '#9db2bd' }}>Low:</div>
            <div style={{ color: '#ff5252', textAlign: 'right' }}>${data.low?.toFixed(2)}</div>
            
            <div style={{ color: '#9db2bd' }}>Close:</div>
            <div style={{ color: data.isPositive ? '#00c896' : '#ff5252', textAlign: 'right', fontWeight: '600' }}>
              ${data.close?.toFixed(2)}
            </div>
            
            <div style={{ color: '#9db2bd' }}>Change:</div>
            <div style={{ 
              color: data.isPositive ? '#00c896' : '#ff5252', 
              textAlign: 'right',
              fontWeight: '500'
            }}>
              {data.isPositive ? '+' : ''}${change.toFixed(2)} ({changePercent > 0 ? '+' : ''}{changePercent.toFixed(2)}%)
            </div>
          </div>
          
          {data.volume > 0 && (
            <div style={{ 
              marginTop: '8px', 
              paddingTop: '6px',
              borderTop: '1px solid #383838',
              fontSize: '11px',
              color: '#9db2bd'
            }}>
              Volume: {data.volume.toLocaleString()}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '400px', 
      backgroundColor: '#1e1e1e', 
      borderRadius: '8px', 
      padding: '15px',
      border: '1px solid #2a2a2a'
    }}>
      <ResponsiveContainer width="100%" height="90%">
        <ComposedChart 
          data={chartData}
          margin={{ top: 10, right: 50, left: 10, bottom: 20 }}
        >
          {/* TradingView-style clean grid */}
          <CartesianGrid 
            strokeDasharray="1 1" 
            stroke="#2a2a2a" 
            opacity={0.4}
            horizontal={true}
            vertical={false}
          />
          
          {/* Clean X-axis */}
          <XAxis 
            dataKey="time" 
            tick={{ 
              fill: '#9db2bd', 
              fontSize: 11,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
            axisLine={{ stroke: '#2a2a2a' }}
            tickLine={false}
            interval="preserveStartEnd"
            tickMargin={8}
          />
          
          {/* Professional Y-axis (right side like TradingView) */}
          <YAxis 
            domain={['dataMin - 1', 'dataMax + 1']}
            tick={{ 
              fill: '#9db2bd', 
              fontSize: 11,
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}
            axisLine={false}
            tickLine={false}
            orientation="right"
            tickMargin={8}
            tickFormatter={(value) => `$${value.toFixed(2)}`}
          />
          
          {/* Professional tooltip */}
          <Tooltip 
            content={<TradingViewTooltip />}
            cursor={{ stroke: '#4a4a4a', strokeWidth: 1, strokeDasharray: '2 2' }}
          />
          
          {/* TradingView-style candlesticks */}
          <Bar 
            dataKey="high" 
            fill="transparent"
            stroke="transparent"
            shape={(props) => <TradingViewCandle {...props} />}
            maxBarSize={25}
          />
        </ComposedChart>
      </ResponsiveContainer>
      
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '8px',
        color: '#666',
        fontSize: '11px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
      }}>
        <span>📊 {symbol} • {timeframe} timeframe</span>
        <span>{chartData.length} candles • TradingView style</span>
      </div>
    </div>
  );
};

export default RechartsStockChart;