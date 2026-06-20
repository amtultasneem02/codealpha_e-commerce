import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { login, user, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '';

  useEffect(() => {
    if (user) {
      navigate(redirect ? `/${redirect}` : '/');
    }
    setError(null);
  }, [user, navigate, redirect, setError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setFormError('Please enter both email and password.');
      return;
    }
    setFormError('');
    setSubmitLoading(true);

    try {
      await login(email, password);
      // navigation is handled by the useEffect on user state change
    } catch (err) {
      setFormError(err.message || 'Invalid credentials');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Sign In</h2>
      
      {formError && <div className="alert alert-danger">{formError}</div>}
      {error && !formError && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn"
          style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
          disabled={submitLoading}
        >
          {submitLoading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="form-footer">
        New Customer?{' '}
        <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="form-link">
          Register here
        </Link>
      </div>
    </div>
  );
};

export default Login;
