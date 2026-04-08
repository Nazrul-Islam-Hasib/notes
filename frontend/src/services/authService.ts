import type { AuthResponse, User } from '../types/Auth';
import {ENDPOINTS} from "../config/api.ts";


export const authService = {
  async register(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(ENDPOINTS.auth.register, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
      const response = await fetch(ENDPOINTS.auth.login, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  async getMe(token: string): Promise<User> {
    const response = await fetch(ENDPOINTS.auth.me, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to get user');
    return data;
  },
};
