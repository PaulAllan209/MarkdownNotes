import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css'
import { signUp } from '../../utils/authenticationUtils';


function SignUpPage() {
    // Sign up fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userName, setuserName] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const [error, setError] = useState('');
    const [fieldErrors, setFieldErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const registerResponse = await signUp(firstName, lastName, userName, password, email);

            if (registerResponse.success) {
                navigate('/login');
            } else {
                setError("Invalid credentials please try again");
                setFieldErrors(registerResponse.errors);
            }


        } catch (err) {
            setError(err.message || 'Failed to Register. Please try again.');
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    }

    const getFieldError = (fieldName) => {
        const mappedFieldName = fieldName === 'firstName' ? 'FirstName' :
                                fieldName === 'lastName' ? 'LastName' :
                                fieldName === 'userName' ? 'UserName' :
                                fieldName === 'password' ? 'Password' :
                                fieldName === 'email' ? 'Email' : fieldName;
        return fieldErrors[mappedFieldName] ?
            <div className="field-error">{fieldErrors[mappedFieldName].join('. ')}</div> : null;
    };

    return (
        <div className="signup-container">
            <div className="signup-form-container">
                <h1>Sign Up</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className={fieldErrors.FirstName ? 'error-input' : '' }
                        />
                        {getFieldError('firstName')}
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className={fieldErrors.FirstName ? 'error-input' : ''}
                        />
                        {getFieldError('lastName')}
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={fieldErrors.FirstName ? 'error-input' : '' }
                        />
                        {getFieldError('email')}
                    </div>

                    <div className="form-group">
                        <label htmlFor="userName">Username</label>
                        <input
                            id="userName"
                            value={userName}
                            onChange={(e) => setuserName(e.target.value)}
                            required
                            className={fieldErrors.FirstName ? 'error-input' : '' }
                        />
                        {getFieldError('userName')}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={fieldErrors.FirstName ? 'error-input' : '' }
                        />
                        {getFieldError('password')}
                    </div>

                    <button
                        type="submit"
                        className="signup-button"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SignUpPage;