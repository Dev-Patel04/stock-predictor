import React, { useState } from 'react';
import './AuthForms.css';

export default function SignUp({ onSwitch, onSignUp, onShowTerms }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validatePassword = (password) => {
    const hasCapital = /[A-Z]/.test(password);
    const hasMinLength = password.length >= 8;
    
    if (!hasCapital && !hasMinLength) {
      return 'Password must be at least 8 characters long and contain at least one capital letter';
    } else if (!hasCapital) {
      return 'Password must contain at least one capital letter';
    } else if (!hasMinLength) {
      return 'Password must be at least 8 characters long';
    }
    return '';
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
    } else {
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        newErrors.password = passwordError;
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      // Simulate signup - in real app, this would make an API call
      onSignUp(formData);
    } else {
      setErrors(newErrors);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return '';
    
    const hasCapital = /[A-Z]/.test(password);
    const hasMinLength = password.length >= 8;
    
    if (hasCapital && hasMinLength) return 'strong';
    if (hasCapital || hasMinLength) return 'medium';
    return 'weak';
  };

  return (
    <div className="auth-form">
      <div className="auth-header">
        <h2>Create Account</h2>
        <p>Join us to start predicting stocks</p>
      </div>
      
      <form onSubmit={handleSubmit} className="auth-form-content">
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
            placeholder="Create a strong password"
          />
          {formData.password && (
            <div className={`password-strength ${getPasswordStrength()}`}>
              Password strength: {getPasswordStrength() || 'weak'}
            </div>
          )}
          {errors.password && <span className="error-message">{errors.password}</span>}
          <div className="password-requirements">
            <small>Password must be at least 8 characters and contain one capital letter</small>
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={errors.confirmPassword ? 'error' : ''}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onChange={handleChange}
              className={errors.acceptTerms ? 'error' : ''}
            />
            <span className="checkmark"></span>
            I agree to the{' '}
            <button 
              type="button" 
              className="link-btn terms-link" 
              onClick={onShowTerms}
            >
              Terms and Conditions
            </button>
          </label>
          {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
        </div>
        
        <button type="submit" className="auth-submit-btn">
          Create Account
        </button>
      </form>
      
      <div className="auth-footer">
        <p>
          Already have an account?{' '}
          <button type="button" className="link-btn" onClick={() => onSwitch('login')}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}