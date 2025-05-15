import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getAccessToken, refreshToken, isTokenExpired } from '../utils/authenticationUtils.js';
function AuthGuard({ children }) {
    const [isChecking, setIsChecking] = useState(true);
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        checkAndRefreshToken();
    }, []);

    const checkAndRefreshToken = async () => {
        try {
            // Checks if access token exists
            if (!getAccessToken()) {
                setIsAuthorized(false);
                setIsChecking(false);
                return;
            }

            // Check if token is expired
            if (isTokenExpired()) {
                console.log("Access token expired, attempting to refresh");
                const refreshState = await refreshToken(); // Returns true is successful refresh
                setIsAuthorized(refreshState);
            } else {
                // Token exists and is valid
                setIsAuthorized(true);
            }

        } catch (error) {
            console.error("Auth error:", error);
            setIsAuthorized(false);
        } finally {
            setIsChecking(false);
        }
    };

    if (isChecking) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

export default AuthGuard;