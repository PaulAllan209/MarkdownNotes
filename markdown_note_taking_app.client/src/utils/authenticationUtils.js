// These are localStorage keys that points to the actual tokens
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const API_URL = import.meta.env.VITE_API_URL;

let isRefreshingToken = false;
let refreshPromise = null;


/**
 * Registers new user to the database
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} userName
 * @param {string} password
 * @param {string} email
 * @returns {Object} Returns object with success status and errors if any
 */
export const signUp = async (firstName, lastName, userName, password, email) => {
    try {
        const signUpDocument = {
            firstname: firstName,
            lastname: lastName,
            username: userName,
            password: password,
            email: email
        };

        const response = await fetch(`${API_URL}/api/authentication`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signUpDocument)
        });

        const data = response.ok ? await response.text() : await response.json();
        console.log("API Response for user registration:", data);

        if (response.ok) {
            console.log("Successful user registration!");
            return { success: true };
        } else {
            console.error("Registration failed");
            return {
                success: false,
                errors: data
            };
        }
    } catch (error) {
        console.error("Error registering new user:", error);
        return {
            success: false,
            errors: {general: [error.message || "An unexpected error occurred"]}
        };
    }
};

/**
 * Authenticates a user with the api and stores tokens
 * @param {string} userName - User's username
 * @param {string} password - User's password
 * @returns {boolean} returns true if successful login
 */
export const login = async (userName, password) => {
    try {
        const loginDocument = {
            username: userName,
            password: password
        };

        const response = await fetch(`${API_URL}/api/authentication/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginDocument)
        });

        const data = await response.json();
        console.log("API Response:", data);

        if (response.ok) {
            console.log("Successful login!");
            storeTokens(data.accessToken, data.refreshToken);
            return true;

        }
        else {
            console.error("Login failed");
            return false;
        }

    } catch (error) {
        console.error("Error logging in:", error);
        console.log(`${API_URL}`);
        return false;
    }
};

/**
 * Store tokens in localStorage/sessionStorage
 */
export const storeTokens = (accessToken, refreshToken) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Get the stored access token
 */
export const getAccessToken = () => {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
};

/**
 * Get the stored refresh token
 */
export const getRefreshToken = () => {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Refresh the access token using the refresh token
 * @returns {boolean} returns true if successfully refreshed the token
 */
export const refreshToken = async () => {
    // If a refresh is already in progress, return the existing promise
    // This prevents the client side to do two api calls for refreshing tokens when on react strict development mode
    if (isRefreshingToken) {
        return refreshPromise;
    }

    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!refreshToken && !accessToken) {
        throw new Error('No refresh token available');
    }

    try {
        isRefreshingToken = true;

        const refreshDocument = {
            'accessToken': accessToken,
            'refreshToken': refreshToken
        }
        console.log(`JSON file before sending refresh to API: ${JSON.stringify(refreshDocument)}`);

        refreshPromise = (async () => {
            const response = await fetch(`${API_URL}/api/token/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(refreshDocument)
            });

            const data = await response.json();
            console.log("API Response for refresh token:", data);

            if (response.ok) {
                storeTokens(data.accessToken, data.refreshToken);
                console.log("Successfully refreshed token");
                return true;
            } else {
                console.error("Error in refreshing the token");
                return false;
            }
        })();

        return await refreshPromise;
    } catch (error) {
        console.error("Error in refreshing the token:", error);
        return false;
    } finally {
        // Reset the flag after the request is complete
        isRefreshingToken = false;
        refreshPromise = null;
    }
};

/**
 * Checks if the access token is expired by decoding it
 * @returns {boolean} True if token is expired or will expire in the next 60 seconds
 */
export const isTokenExpired = () => {
    const token = getAccessToken();
    if (!token) return true;

    try {
        // Get expiration time from existing JWT token without api call
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));

        if (!payload.exp) return true;

        // Get expiration time and current time in seconds
        // Add 30 seconds buffer to refresh slightly before expiration
        // So it checks if the token time is less than 30 seconds it will return true to say that it is expired
        // The expiration of access token is 60 seconds in the backend
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < (currentTime + 30);
    } catch (error) {
        console.error("Error decoding token:", error);
        return true;
    }
};

/**
 * Log out the user by clearing stored tokens and data
 */
export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}