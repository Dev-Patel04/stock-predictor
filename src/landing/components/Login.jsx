import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './AuthForms.css';

export default function Login({ onSwitch }) {
  const { signIn, resetPassword } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    // Clear success message when user starts typing
    if (successMessage) {
      setSuccessMessage('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      setErrors({}); // Clear any previous errors
      setSuccessMessage(''); // Clear any previous success messages
      
      try {
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          // Handle specific Supabase auth errors with user-friendly messages
          let errorMessage = '';
          
          if (error.message.includes('Invalid login credentials')) {
            errorMessage = 'Invalid email or password. Please check your credentials and try again.';
          } else if (error.message.includes('Email not confirmed')) {
            setSuccessMessage('Please check your email and click the confirmation link to activate your account, then try signing in again.');
            return; // Don't show error, show success message instead
          } else if (error.message.includes('Too many requests')) {
            errorMessage = 'Too many login attempts. Please wait a moment before trying again.';
          } else if (error.message.includes('User not found')) {
            errorMessage = 'No account found with this email address. Please sign up first.';
          } else if (error.message.includes('Invalid password')) {
            errorMessage = 'Incorrect password. Please try again or reset your password.';
          } else {
            // Fallback for other errors
            errorMessage = error.message || 'Sign in failed. Please try again.';
          }
          
          setErrors({ general: errorMessage });
        }
        // If successful, the AuthContext will handle the redirect
      } catch (error) {
        console.error('Login error:', error);
        setErrors({ general: 'An unexpected error occurred. Please try again.' });
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleForgotPassword = () => {
    setResetEmail(formData.email || '');
    setShowResetModal(true);
    setResetSuccess(false);
    setErrors({});
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      setErrors({ reset: 'Please enter a valid email address' });
      return;
    }

    setResetLoading(true);
    setErrors({});
    
    try {
      const { error } = await resetPassword(resetEmail);
      
      if (error) {
        setErrors({ reset: error.message });
      } else {
        setResetSuccess(true);
      }
    } catch (error) {
      setErrors({ reset: 'An unexpected error occurred' });
    } finally {
      setResetLoading(false);
    }
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setResetEmail('');
    setResetSuccess(false);
    setErrors({});
  };

  return (
    <div className="auth-form">
      <div className="auth-header">
        <h2>Welcome Back</h2>
        <p>Sign in to your account</p>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form-content">
        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}
        
        {successMessage && (
          <div className="success-message general-success">
            {successMessage}
          </div>
        )}
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
            placeholder="Enter your email"
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password ? 'error' : ''}
            placeholder="Enter your password"
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>
        
        <button type="submit" className="auth-submit-btn" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
        
        <div className="forgot-password">
          <button 
            type="button" 
            className="link-btn" 
            onClick={handleForgotPassword}
          >
            Forgot your password?
          </button>
        </div>
      </form>
      
      <div className="auth-footer">
        <p>
          Don't have an account?{' '}
          <button type="button" className="link-btn" onClick={() => onSwitch('signup')}>
            Sign up
          </button>
        </p>
      </div>

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="modal-overlay" onClick={closeResetModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Reset Password</h3>
              <button className="modal-close" onClick={closeResetModal}>×</button>
            </div>
            
            {!resetSuccess ? (
              <form onSubmit={handleResetPassword} className="reset-form">
                <p>Enter your email address and we'll send you a link to reset your password.</p>
                
                {errors.reset && (
                  <div className="error-message general-error">
                    {errors.reset}
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="resetEmail">Email Address</label>
                  <input
                    type="email"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="Enter your email"
                    className={errors.reset ? 'error' : ''}
                    required
                  />
                </div>
                
                <div className="modal-actions">
                  <button 
                    type="button" 
                    className="modal-cancel-btn" 
                    onClick={closeResetModal}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="modal-submit-btn" 
                    disabled={resetLoading}
                  >
                    {resetLoading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="reset-success">
                <div className="success-icon">✅</div>
                <h4>Check Your Email!</h4>
                <p>
                  We've sent a password reset link to <strong>{resetEmail}</strong>
                </p>
                <p className="reset-instructions">
                  Click the link in the email to reset your password. The link will expire in 1 hour.
                </p>
                <button 
                  className="modal-submit-btn" 
                  onClick={closeResetModal}
                >
                  Got it!
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
