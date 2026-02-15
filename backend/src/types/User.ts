import { Document } from 'mongoose';
import { Request } from 'express';

export interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserResponse {
  id: string;
  email: string;
}

export interface AuthResponse {
  user: UserResponse;
  token: string;
}

/**
 * Extends Express Request to include authenticated userId.
 * Used after authMiddleware verifies the JWT.
 */
export interface AuthRequest extends Request {
  userId?: string;
}
