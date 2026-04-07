const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 * Validates the Authorization header and decodes the JWT token.
 */
const authenticateToken = (req, res, next) => {
  // 1. Check if Authorization header exists
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    const error = new Error('Access denied. No token provided.');
    error.statusCode = 401;
    return next(error);
  }

  // 2. Verify the token
  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      const error = new Error('Invalid or expired token.');
      error.statusCode = 403;
      return next(error);
    }
    
    // 3. Attach user payload to the request object for the next middleware/controller
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;