import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';
import {AuthRequest} from "../types/User";


/**
 * Authentication middleware.
 *
 * Responsibilities:
 * - Extract JWT from Authorization header
 * - Verify token
 * - Attach userId to request object
 * - Block request if token is missing or invalid
 */
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;

    // Ensure the header exists and follows the "Bearer < token >" format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided' });
      return;
    }

    // Extract token from the header
    const token = authHeader.split(' ')[1];

    // Verify token and decode payload
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    // Attach decoded userId to request for downstream handlers
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
