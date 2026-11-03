import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthUser } from '../types/common.types';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const signJwt = (user: AuthUser, expiresIn: string = env.JWT_EXPIRES_IN): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const options: SignOptions = {
    expiresIn: expiresIn as any,
  };

  return jwt.sign(payload, env.JWT_SECRET, options);
};

export const verifyJwt = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch (error) {
    return null;
  }
};

