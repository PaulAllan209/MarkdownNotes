import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // TODO: API communication logic would go here
            // 1. Send POST request to login endpoint with email and password
            // 2. Expected response would contain authentication token and user info
            // 3. Store authentication token in localStorage/sessionStorage
            // 4. Navigate to main page on success

            // For demonstration purposes:
            console.log('Login attempt with:', { email, password });
            setTimeout(() => {
                setIsLoading(false);
                navigate('/');
            }, 1000);

        } catch (err) {
            setError(err.message || 'Failed to login. Please try again.');
            setIsLoading(false);
        }
    }

  return (
      <div className="login-container">
          <div className="login-form-container">
              <h1>Login</h1>

              {error && <div className="error-message">{error}</div>}

              <form onSubmit={handleSubmit}>
                  <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                      />
                  </div>

                  <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                          type="password"
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                      />
                  </div>

                  <button
                      type="submit"
                      className="login-button"
                      disabled={isLoading}
                  >
                      {isLoading ? 'Logging in...' : 'Log in'}
                  </button>
              </form>

              <div className="signup-link">
                  <span
                      onClick={() => console.log('Navigate to signup page')}
                      className="signup-text"
                  >
                      Sign up
                  </span>
              </div>
          </div>
      </div>
  );
}

export default LoginPage;