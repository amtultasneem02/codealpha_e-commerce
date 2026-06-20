import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const { register, user, error, setError } = useAuth();
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
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    setFormError('');
    setSubmitLoading(true);

    try {
      await register(name, email, password);
    } catch (err) {
      setFormError(err.message || 'Registration failed');
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h2 className="form-title">Create Account</h2>
      
      {formError && <div className="alert alert-danger">{formError}</div>}
      {error && !formError && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

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

        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
              <Loader2 className="animate-spin" size={18} /> Registering...
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>

      <div className="form-footer">
        Have an Account?{' '}
        <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="form-link">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default Register;
