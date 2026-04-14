/**
 * Simple logger utility for consistent console output
 * In production, consider using Winston or Pino
 */

const logLevels = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG',
};

const colors = {
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

const logger = {
  error: (message, error = null) => {
    console.error(
      `${colors.red}[${new Date().toISOString()}] ${logLevels.ERROR}: ${message}${colors.reset}`,
      error || ''
    );
  },

  warn: (message) => {
    console.warn(
      `${colors.yellow}[${new Date().toISOString()}] ${logLevels.WARN}: ${message}${colors.reset}`
    );
  },

  info: (message) => {
    console.log(
      `${colors.green}[${new Date().toISOString()}] ${logLevels.INFO}: ${message}${colors.reset}`
    );
  },

  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(
        `${colors.blue}[${new Date().toISOString()}] ${logLevels.DEBUG}: ${message}${colors.reset}`
      );
    }
  },
};

module.exports = logger;
