const isDevelopment = import.meta.env.MODE === "development";

/**
 * Log an informational message
 * @param {string} message - The message to log
 * @param {object} context - Additional context data
 */
export const logInfo = (message, context = {}) => {
  if (isDevelopment) {
    console.log(`[INFO] ${message}`, context);
  }
};

/**
 * Log a warning message
 * @param {string} message - The warning message
 * @param {object} context - Additional context data
 */
export const logWarning = (message, context = {}) => {
  if (isDevelopment) {
    console.warn(`[WARNING] ${message}`, context);
  }
};

/**
 * Log an error
 * @param {string|Error} error - The error message or Error object
 * @param {object} context - Additional context data
 */
export const logError = (error, context = {}) => {
  const timestamp = new Date().toISOString();

  if (error instanceof Error) {
    console.error(`[ERROR] ${timestamp}`, {
      message: error.message,
      stack: error.stack,
      ...context,
    });
  } else {
    console.error(`[ERROR] ${timestamp}`, {
      message: error,
      ...context,
    });
  }
};

/**
 * Log debug information (only in development)
 * @param {string} message - The debug message
 * @param {any} data - Data to log
 */
export const logDebug = (message, data = null) => {
  if (isDevelopment) {
    console.debug(`[DEBUG] ${message}`, data);
  }
};

/**
 * Performance logging
 * @param {string} label - Label for the performance mark
 * @param {function} fn - Function to measure
 */
export const logPerformance = async (label, fn) => {
  if (!isDevelopment) {
    return await fn();
  }

  const start = performance.now();
  try {
    const result = await fn();
    const duration = performance.now() - start;
    console.log(`[PERFORMANCE] ${label}: ${duration.toFixed(2)}ms`);
    return result;
  } catch (error) {
    const duration = performance.now() - start;
    console.error(
      `[PERFORMANCE] ${label} failed after ${duration.toFixed(2)}ms`,
      error,
    );
    throw error;
  }
};
