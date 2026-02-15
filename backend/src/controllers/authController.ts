import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import { User } from '../models/User';
import type {UserResponse, AuthResponse, AuthRequest} from '../types/User';

const JWT_EXPIRES_IN = '7d';

/**
 * Formats a user object to return only safe public fields.
 * Ensures we never accidentally expose sensitive data.
 */
const formatUserResponse = (user: any): UserResponse => ({
  id: user._id.toString(),
  email: user.email,
});

/**
 * Generates a signed JWT token containing the user ID.
 */
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Registers a new user.
 *
 * Steps:
 * - Validate input
 * - Check if email already exists
 * - Create user
 * - Generate JWT
 * - Return user + token
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Create and save new user
    const user = new User({ email, password });
    await user.save();

    // Generate JWT
    const token = generateToken(user._id.toString());

    const response: AuthResponse = {
      user: formatUserResponse(user),
      token,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Logs in an existing user.
 *
 * Steps:
 * - Validate input
 * - Find user by email
 * - Compare password with bcrypt
 * - Generate JWT
 * - Return user + token
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    const token = generateToken(user._id.toString());
    const response: AuthResponse = {
      user: formatUserResponse(user),
      token,
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Returns the currently authenticated user's public information.
 *
 * the token and attached userId to the request object.
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(formatUserResponse(user));
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
