import React, { useState } from 'react';
import ModelTemplate from '../templates/components/ModelTemplate';
import ExistingModels from '../templates/components/ExistingModels';

export default function Predictor() {
  const [selected, setSelected] = useState(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showExisting, setShowExisting] = useState(false);

  const handleSelect = (option) => {
    setSelected(option);
    if (option === 'create') {
      setShowTemplates(true);
    } else if (option === 'existing') {
      setShowExisting(true);
    }
  };

  const handleBackFromTemplates = () => {
    setShowTemplates(false);
    setSelected(null);
  };

  const handleBackFromExisting = () => {
    setShowExisting(false);
    setSelected(null);
  };

  return (
    <div>
      {showTemplates ? (
        <ModelTemplate 
          onBack={handleBackFromTemplates}
        />
      ) : showExisting ? (
        <ExistingModels 
          onBack={handleBackFromExisting}
        />
      ) : (
        <>
          <h2>Stock Predictor</h2>
          {!selected ? (
            <div style={{ marginTop: '1.5rem' }}>
              <p>Choose how you want to predict stocks:</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => handleSelect('create')} style={{ padding: '0.7rem 1.2rem' }}>Create Your Own Model</button>
                <button onClick={() => handleSelect('existing')} style={{ padding: '0.7rem 1.2rem' }}>Choose Existing Model</button>
                <button onClick={() => handleSelect('ai')} style={{ padding: '0.7rem 1.2rem' }}>Use Our AI Model</button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '2rem' }}>
              {selected === 'ai' && (
                <>
                  <h3>Our AI Model</h3>
                  <p>Get predictions using our built-in AI model. (Coming soon)</p>
                </>
              )}
              <button onClick={() => setSelected(null)} style={{ marginTop: '1.5rem', padding: '0.5rem 1rem' }}>Back</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
