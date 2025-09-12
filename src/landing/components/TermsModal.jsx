import React from 'react';
import './TermsModal.css';

export default function TermsModal({ isOpen, onClose, onAccept }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="terms-modal-overlay" onClick={handleOverlayClick}>
      <div className="terms-modal">
        <div className="terms-header">
          <h2>Terms and Conditions</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="terms-content">
          <div className="terms-section">
            <h3>1. Acceptance of Terms</h3>
            <p>
              By accessing and using Stock Predictor, you accept and agree to be bound by the terms 
              and provision of this agreement. If you do not agree to abide by the above, please do 
              not use this service.
            </p>
          </div>
          
          <div className="terms-section">
            <h3>2. Use License</h3>
            <p>
              Permission is granted to temporarily access Stock Predictor for personal, 
              non-commercial transitory viewing only. This is the grant of a license, not a 
              transfer of title, and under this license you may not:
            </p>
            <ul>
              <li>modify or copy the materials</li>
              <li>use the materials for any commercial purpose or for any public display</li>
              <li>attempt to reverse engineer any software contained on the website</li>
              <li>remove any copyright or other proprietary notations from the materials</li>
            </ul>
          </div>
          
          <div className="terms-section">
            <h3>3. Disclaimer</h3>
            <p>
              The materials on Stock Predictor are provided on an 'as is' basis. Stock Predictor 
              makes no warranties, expressed or implied, and hereby disclaims and negates all other 
              warranties including without limitation, implied warranties or conditions of 
              merchantability, fitness for a particular purpose, or non-infringement of intellectual 
              property or other violation of rights.
            </p>
          </div>
          
          <div className="terms-section">
            <h3>4. Investment Disclaimer</h3>
            <p>
              Stock predictions provided by this service are for informational purposes only and 
              should not be considered as financial advice. All investments carry risk, and past 
              performance does not guarantee future results. Please consult with a qualified 
              financial advisor before making investment decisions.
            </p>
          </div>
          
          <div className="terms-section">
            <h3>5. Limitations</h3>
            <p>
              In no event shall Stock Predictor or its suppliers be liable for any damages 
              (including, without limitation, damages for loss of data or profit, or due to 
              business interruption) arising out of the use or inability to use the materials 
              on Stock Predictor, even if Stock Predictor or its authorized representative has 
              been notified orally or in writing of the possibility of such damage.
            </p>
          </div>
          
          <div className="terms-section">
            <h3>6. Privacy Policy</h3>
            <p>
              Your privacy is important to us. We collect and use your information in accordance 
              with our Privacy Policy. By using our service, you consent to the collection and 
              use of information as outlined in our Privacy Policy.
            </p>
          </div>
          
          <div className="terms-section">
            <h3>7. Modifications</h3>
            <p>
              Stock Predictor may revise these terms of service at any time without notice. 
              By using this service, you are agreeing to be bound by the then current version 
              of these terms of service.
            </p>
          </div>
        </div>
        
        <div className="terms-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="accept-btn" onClick={onAccept}>
            Accept Terms
          </button>
        </div>
      </div>
    </div>
  );
}