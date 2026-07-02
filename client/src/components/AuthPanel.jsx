import { useState } from 'react';

export default function AuthPanel({ mode = 'login', onClose, onLogin, onRegister }) {
  const [authMode, setAuthMode] = useState(mode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isSignup = authMode === 'signup';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await onRegister({ name, email, password });
      } else {
        await onLogin({ email, password });
      }
      onClose();
    } catch (caughtError) {
      setError(caughtError.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="auth-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="auth-panel-header">
          <div>
            <div className="company-list-eyebrow">Account</div>
            <h2 id="auth-title">{isSignup ? 'Create account' : 'Welcome back'}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose}>
            Close
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && (
            <label>
              Name
              <input value={name} onChange={(event) => setName(event.target.value)} required />
            </label>
          )}

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              minLength={6}
              required
            />
          </label>

          {error && <div className="form-error">{error}</div>}

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? 'Please wait...' : isSignup ? 'Sign up' : 'Log in'}
          </button>
        </form>

        <button
          type="button"
          className="text-button"
          onClick={() => {
            setError('');
            setAuthMode(isSignup ? 'login' : 'signup');
          }}
        >
          {isSignup ? 'Already have an account? Log in' : 'New here? Create an account'}
        </button>
      </section>
    </div>
  );
}
