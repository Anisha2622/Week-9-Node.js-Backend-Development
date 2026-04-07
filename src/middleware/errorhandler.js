/**
 * Global Error Handling Middleware
 * Catches errors thrown by routes or previous middleware and formats a standard JSON response.
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  
  // Set default status code to 500 if not specified
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      // Only include stack trace in development mode for security
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

module.exports = errorHandler;