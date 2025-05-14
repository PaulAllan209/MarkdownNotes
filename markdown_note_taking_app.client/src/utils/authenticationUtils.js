const ACCESS_TOKEN_KEY = '';
const REFRESH_TOKEN_KEY = '';

/**
 * Registers new user to the database
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} userName
 * @param {string} password
 * @param {string} email
 * @returns {boolean} returns true if successful registration
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

        const response = await fetch('https://localhost:7271/api/authentication', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signUpDocument)
        });

        const data = await response.json();
        console.log("API Response for user registration:", data);

        if (response.ok) {
            console.log("Successful user registration!");
            return true;
        } else {
            console.error("Registration failed");
            return false;
        }
    } catch (error) {
        console.error("Error registering new user:", error);
        return false;
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

        const response = await fetch('https://localhost:7271/api/authentication/login', {
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
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
    // TODO: API endpoint to check if authenticated
    return !!getAccessToken();
};

/**
 * Refresh the access token using the refresh token
 */
export const refreshToken = async () => {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    if (!refreshToken && !accessToken) {
        throw new Error('No refresh token available');
    }

    try {
        const refreshDocument = {
            accessToken: getAccessToken(),
            refreshToken: getRefreshToken()
        }

        const response = fetch('https://localhost:7271/api/token/refresh', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(refreshDocument)
        })

        const data = await response.json();
        console.log("API Response for refresh token:", data);

        if (response.ok) {
            storeTokens(data.accessToken, data.refreshToken);
        } else {
            console.error("Error in refreshing the token");
        }

    } catch (error) {
        console.error("Error in refreshing the token:", error);
    }
};

/**
 * Log out the user by clearing stored tokens and data
 */
export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);

    //TODO: Create endpoint for logging out
}