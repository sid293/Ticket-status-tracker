import jwt from 'jsonwebtoken';

/**
 * Authenticate middleware to verify JWT tokens
 * @param {Object} req - Express request object
 * @param {Object} req.headers - Request headers
 * @param {string} req.headers.authorization - Authorization header with Bearer token
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Missing or invalid Authorization header. Expected: Bearer <token>' 
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ 
        error: 'Server misconfiguration', 
        message: 'JWT_SECRET is not set' 
      });
    }

    const payload = jwt.verify(token, secret);
    req.user = { 
      userId: payload.userId,
      email: payload.email,
      name: payload.name
    };
    next();
  } catch (err) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid or expired token' 
    });
  }
}


