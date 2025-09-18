import React, { useState } from 'react';
import './Tabs.css';

const tabData = [
  { label: 'Dashboard', icon: '📊' },
  { label: 'Predictor', icon: '🚀' },
  { label: 'History', icon: '📈' },
  { label: 'News', icon: '📰' },
  { label: 'Settings', icon: '⚙️' }
];

export default function Tabs({ children, activeTab, onTabChange }) {
  const [internalActiveTab, setInternalActiveTab] = useState(0);
  
  // Use external activeTab if provided, otherwise use internal state
  const currentTab = activeTab !== undefined ? activeTab : internalActiveTab;
  
  const handleTabClick = (index) => {
    if (onTabChange) {
      onTabChange(index);
    } else {
      setInternalActiveTab(index);
    }
  };

  return (
    <div className="tabs-container">
      <div className="tabs">
        {tabData.map((tab, idx) => (
          <div
            key={tab.label}
            className={`tab${currentTab === idx ? ' active' : ''}`}
            onClick={() => handleTabClick(idx)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </div>
        ))}
      </div>
      <div className="tab-content">
        {children[currentTab]}
      </div>
    </div>
  );
}
