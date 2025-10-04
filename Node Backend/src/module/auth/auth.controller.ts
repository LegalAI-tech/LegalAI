import type { Request, Response, NextFunction } from 'express';
import authService from './auth.service.js';
import type { AuthRequest } from '../../middleware/auth.middleware.js';

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;

      const result = await authService.register(email, password, name);

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const result = await authService.login(email, password);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      const result = await authService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const userId = req.user!.id;

      await authService.logout(userId, refreshToken);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const result = await authService.handleOAuthCallback(user);

      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL;
      res.redirect(
        `${frontendUrl}/auth/callback?token=${result.accessToken}&refreshToken=${result.refreshToken}`
      );
    } catch (error) {
      next(error);
    }
  }

  async metaCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user;
      const result = await authService.handleOAuthCallback(user);

      // Redirect to frontend with tokens
      const frontendUrl = process.env.FRONTEND_URL;
      res.redirect(
        `${frontendUrl}/auth/callback?token=${result.accessToken}&refreshToken=${result.refreshToken}`
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();