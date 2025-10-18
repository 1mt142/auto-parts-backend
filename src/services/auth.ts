import crypto from 'crypto';
import { prisma } from '../config/prisma';
import { hashPassword, comparePassword } from '../utils/password';
import { generateTokens, JwtPayload } from '../utils/jwt';
import { ApiError, errorMessages } from '../utils/errors';
import { logger } from '../utils/logger';

export class AuthService {
  async register(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ApiError(409, errorMessages.USER_EXISTS);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password_hash: hashedPassword,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken } = generateTokens(payload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const ss = await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt,
      },
    });

    console.log('ss', ss);

    return { user, accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new ApiError(401, errorMessages.INVALID_CREDENTIALS);
    }

    const isValidPassword = await comparePassword(password, user.password_hash);

    if (!isValidPassword) {
      throw new ApiError(401, errorMessages.INVALID_CREDENTIALS);
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const { accessToken, refreshToken } = generateTokens(payload);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    const hashedRefreshToken = crypto
      .createHash('sha256')
      .update(refreshToken)
      .digest('hex');

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: hashedRefreshToken,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: string, refreshToken: string) {
    await prisma.refreshToken.deleteMany({
      where: {
        userId,
        token: refreshToken,
      },
    });
  }
}

export const authService = new AuthService();
