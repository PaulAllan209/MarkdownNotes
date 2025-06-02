import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAccessToken } from '../utils/authenticationUtils.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check on initial load if the user is authenticated
    useEffect(() => {
        const token = getAccessToken();
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}