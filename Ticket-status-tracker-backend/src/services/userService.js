import User from '../models/User.js';
import jwt from 'jsonwebtoken';

/**
 * Create a new user
 * @param {Object} userData - User data
 * @param {string} userData.name - User's full name
 * @param {string} userData.email - User's email address
 * @param {string} userData.password - User's password
 * @returns {Promise<Object>} - Created user (without password)
 */
export const createUser = async (userData) => {
  try {
    const { name, email, password } = userData;

    // Check if user already exists by email
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      throw new Error('Email already registered');
    }

    // Create new user (userId will be auto-generated in pre-save hook)
    const user = new User({ name, email, password });
    await user.save();

    // Return user without password
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      userId: user.userId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  } catch (error) {
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

/**
 * Find user by email
 * @param {string} email - User's email address
 * @returns {Promise<Object|null>} - User object or null if not found
 */
export const getUserByEmail = async (email) => {
  try {
    const user = await User.findOne({ email });
    return user;
  } catch (error) {
    throw new Error(`Failed to find user by email: ${error.message}`);
  }
};

/**
 * Find user by ID
 * @param {string} userId - User's ID
 * @returns {Promise<Object|null>} - User object or null if not found
 */
export const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user;
  } catch (error) {
    throw new Error(`Failed to find user by ID: ${error.message}`);
  }
};

/**
 * Find user by userId (custom field)
 * @param {string} userId - User's custom userId field
 * @returns {Promise<Object|null>} - User object or null if not found
 */
export const getUserByUserId = async (userId) => {
  try {
    const user = await User.findOne({ userId });
    return user;
  } catch (error) {
    throw new Error(`Failed to find user by userId: ${error.message}`);
  }
};

/**
 * Verify user password
 * @param {Object} user - User object
 * @param {string} password - Password to verify
 * @returns {Promise<boolean>} - True if password is valid
 */
export const verifyPassword = async (user, password) => {
  try {
    return await user.comparePassword(password);
  } catch (error) {
    throw new Error(`Failed to verify password: ${error.message}`);
  }
};

/**
 * Generate JWT token for user
 * @param {Object} user - User object
 * @returns {string} - JWT token
 */
export const generateToken = (user) => {
  try {
    return jwt.sign(
      { userId: user.userId, email: user.email, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
  } catch (error) {
    throw new Error(`Failed to generate token: ${error.message}`);
  }
};

/**
 * Update user profile
 * @param {string} userId - User's ID
 * @param {Object} updateData - Update data
 * @param {string} updateData.name - Updated name
 * @param {string} updateData.email - Updated email
 * @returns {Promise<Object>} - Updated user (without password)
 */
export const updateUser = async (userId, updateData) => {
  try {
    const { name, email } = updateData;

    // Check if email is being changed and if it already exists
    if (email) {
      const existingUser = await User.findOne({ 
        email, 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        throw new Error('Email already in use');
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!user) {
      throw new Error('User not found');
    }

    // Return user without password
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      userId: user.userId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  } catch (error) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

/**
 * Change user password
 * @param {string} userId - User's ID
 * @param {string} currentPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<boolean>} - True if password changed successfully
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await User.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return true;
  } catch (error) {
    throw new Error(`Failed to change password: ${error.message}`);
  }
};

/**
 * Delete user account
 * @param {string} userId - User's ID
 * @returns {Promise<Object>} - Deleted user (without password)
 */
export const deleteUser = async (userId) => {
  try {
    const user = await User.findByIdAndDelete(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    // Return user without password
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      userId: user.userId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

/**
 * Get all users (admin function)
 * @param {Object} pagination - Pagination options
 * @param {number} pagination.page - Page number (default: 1)
 * @param {number} pagination.limit - Items per page (default: 10)
 * @returns {Promise<Object>} - Users with pagination info
 */
export const getAllUsers = async (pagination = {}) => {
  try {
    const page = parseInt(pagination.page) || 1;
    const limit = parseInt(pagination.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await User.countDocuments();

    return {
      items: users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }
};

export default {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUserId,
  verifyPassword,
  generateToken,
  updateUser,
  changePassword,
  deleteUser,
  getAllUsers
};
