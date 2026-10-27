import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import './Auth.css';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) { setError('Please fill in all fields.'); return; }
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setError('Demo mode: Account creation is not implemented in this demo.');
  };

  const benefits = [
    'Access 1,000+ verified grant opportunities',
    'Save and track your favorite grants',
    'Get deadline reminders and alerts',
    'Expert application guidance',
  ];

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <Link to="/">
            <div className="auth-logo">E</div>
          </Link>
          <h1>Create your account</h1>
          <p>Join thousands finding grant opportunities on EastAidGrant</p>
        </div>

        <div className="auth-benefits">
          {benefits.map((b, i) => (
            <div key={i} className="auth-benefit">
              <CheckCircle size={15} />
              <span>{b}</span>
            </div>
          ))}
        </div>

        {error && (
          <div className="auth-alert">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Your full name"
              className="form-input"
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="you@domain.com"
              className="form-input"
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="pw-field">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => set('password', e.target.value)}
                placeholder="Minimum 8 characters"
                className="form-input"
                autoComplete="new-password"
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPw((v) => !v)}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="pw-field">
              <input
                type={showPw ? 'text' : 'password'}
                value={form.confirm}
                onChange={(e) => set('confirm', e.target.value)}
                placeholder="Re-enter password"
                className="form-input"
                autoComplete="new-password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading
              ? <><div className="spinner" style={{ width: 16, height: 16 }} /> Creating account...</>
              : 'Create Free Account'}
          </button>
        </form>

        <p className="auth-terms" style={{ marginTop: 16 }}>
          By signing up you agree to our{' '}
          <Link to="/resources">Terms of Service</Link> and{' '}
          <Link to="/resources">Privacy Policy</Link>.
        </p>

        <div className="auth-divider"><span>already have an account?</span></div>

        <div className="auth-footer">
          <Link to="/login" className="btn btn-outline" style={{ width: '100%', justifyContent: 'center' }}>
            Sign In
          </Link>
        </div>

        <p className="auth-demo-note">
          This is a demonstration. No real account will be created.
        </p>
      </div>

      <div className="auth-side">
        <img src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80" alt="Success" />
        <div className="auth-side-overlay">
          <div className="auth-side-content">
            <h2>Your future starts here</h2>
            <p>Real Opportunities. Lasting Impact.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
