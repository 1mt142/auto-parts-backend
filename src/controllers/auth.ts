import { Request, Response } from 'express';
import { authService } from '../services/auth';
import { asyncHandler } from '../middlewares/error';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  const result = await authService.register(name, email, password);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: result,
  });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const refreshToken = req.body.refreshToken;

  await authService.logout(userId, refreshToken);

  res.status(200).json({
    success: true,
    message: 'Logout successful',
  });
});
