import * as userService from '../services/userService.js';

/**
 * Register a new user
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user data
 * @param {string} req.body.name - User's full name
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists by email
    const existingUser = await userService.getUserByEmail(email);
    
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'Email already registered'
      });
    }

    // Create new user
    const user = await userService.createUser({ name, email, password });

    // Generate JWT token
    const token = userService.generateToken(user);

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user
    });
  } catch (err) {
    if (err.message.includes('Email already registered')) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'Email already registered'
      });
    }
    next(err);
  }
}

/**
 * Login an existing user
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing login credentials
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await userService.getUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'User not found'
      });
    }

    // Verify password
    const isPasswordValid = await userService.verifyPassword(user, password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid credentials',
        message: 'Incorrect password'
      });
    }

    // Generate JWT token
    const token = userService.generateToken(user);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userId: user.userId
      }
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Logout user (client-side token discard)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export async function logout(req, res, next) {
  try {
    // For stateless JWTs, logout is handled client-side by discarding the token
    // For enhanced security, you could implement token blacklisting here
    res.status(200).json({ 
      message: 'Logged out successfully. Please discard your token on the client side.' 
    });
  } catch (err) {
    next(err);
  }
}


