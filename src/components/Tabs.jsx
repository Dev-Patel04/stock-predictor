import React, { useState } from 'react';
import './Tabs.css';

const tabData = [
  { label: 'Predictor', icon: '🪐' },
  { label: 'History', icon: '📈' },
  { label: 'News', icon: '📰' },
  { label: 'Settings', icon: '⚙️' }
];

export default function Tabs({ children }) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="tabs-container">
      <div className="tabs">
        {tabData.map((tab, idx) => (
          <div
            key={tab.label}
            className={`tab${activeTab === idx ? ' active' : ''}`}
            onClick={() => setActiveTab(idx)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </div>
        ))}
      </div>
      <div className="tab-content">
        {children[activeTab]}
      </div>
    </div>
  );
}
