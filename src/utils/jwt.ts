import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export const generateTokens = (payload: JwtPayload) => {
  // @ts-ignore: This is a known issue with jwt.sign overloads and custom interfaces.
  const accessToken = jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpire,
  });

  // @ts-ignore: This is a known issue with jwt.sign overloads and custom interfaces.
  const refreshToken = jwt.sign(payload, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpire,
  });

  return { accessToken, refreshToken };
};

export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, env.jwtSecret) as JwtPayload;
  } catch {
    return null;
  }
};

export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, env.jwtRefreshSecret) as JwtPayload;
  } catch {
    return null;
  }
};
