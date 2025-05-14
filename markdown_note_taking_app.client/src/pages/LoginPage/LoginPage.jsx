import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import { login } from '../../utils/authenticationUtils';

function LoginPage() {
    const [userName, setuserName] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const loginResponse = await login(userName, password);

            if (loginResponse) {
                navigate('/');
            } else {
                setError("Invalid username or password. Please try again.");
            }


        } catch (err) {
            setError(err.message || 'Failed to login. Please try again.');
            setIsLoading(false);
        } finally {
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
                      <label htmlFor="userName">Username</label>
                      <input
                          id="userName"
                          value={userName}
                          onChange={(e) => setuserName(e.target.value)}
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
                      onClick={ handleSubmit }
                  >
                      {isLoading ? 'Logging in...' : 'Log in'}
                  </button>
              </form>

              <div className="signup-link">
                  <span
                      onClick={() => navigate('/signup')}
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