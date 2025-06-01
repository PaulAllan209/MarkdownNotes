// Logger configuration
const logConfig = {
    // Enable/disable logging by module
    modules: {
        api: true,
        localStorage: true,
        components: true
    },

    // Global log level
    level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',

    // Enable/disable all logging in production
    enabledInProduction: false
};

// Log levels with numeric priority
const LOG_LEVELS = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3
};

// Logger factory for a specific module
export function createLogger(moduleName) {
    const isProduction = process.env.NODE_ENV === 'production';

    const shouldLog = () => {
        return (isProduction && logConfig.enabledInProduction) ||
            (!isProduction && logConfig.modules[moduleName]);
    };

    // Format log messages with module name
    const formatLog = (level, ...args) => {
        const timestamp = new Date().toISOString();
        return [`[${timestamp}][${moduleName}][${level.toUpperCase()}]`, ...args];
    };

    // Create logger methods for each level
    return {
        debug: (...args) => {
            if (shouldLog() && LOG_LEVELS[logConfig.level] <= LOG_LEVELS.debug) {
                console.debug(...formatLog('debug', ...args));
            }
        },
        info: (...args) => {
            if (shouldLog() && LOG_LEVELS[logConfig.level] <= LOG_LEVELS.info) {
                console.info(...formatLog('info', ...args));
            }
        },
        warn: (...args) => {
            if (shouldLog() && LOG_LEVELS[logConfig.level] <= LOG_LEVELS.warn) {
                console.warn(...formatLog('warn', ...args));
            }
        },
        error: (...args) => {
            if (shouldLog() && LOG_LEVELS[logConfig.level] <= LOG_LEVELS.error) {
                console.error(...formatLog('error', ...args));
            }
        },

        // Additional method to enable/disable this specific logger at runtime
        setEnabled: (enabled) => {
            logConfig.modules[moduleName] = enables;
        }
    };
};

// Method to configure all loggers
export function configureLoggers(config) {
    Object.assign(logConfig, config);
}
