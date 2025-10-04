import type { Response } from 'express';
import type { NextFunction } from 'express';
import type { AuthRequest } from '../../middleware/auth.middleware.js';
import chatService from './chat.service.js';
import type { Multer } from 'multer';

// Extend AuthRequest to include file property for multer
interface AuthRequestWithFile extends AuthRequest {
  file?: Express.Multer.File;
}

class ChatController {
  async createConversation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { title, mode, documentId, documentName } = req.body;

      const conversation = await chatService.createConversation(
        userId, 
        title, 
        mode,
        documentId,
        documentName
      );

      res.status(201).json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }

  async sendMessage(req: AuthRequestWithFile, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { conversationId } = req.params;
      const { message, mode } = req.body;
      
      if (!conversationId) {
        return res.status(400).json({
          success: false,
          message: 'Conversation ID is required',
        });
      }
      
      const file = req.file
        ? { buffer: req.file.buffer, fileName: req.file.originalname }
        : undefined;

      const result = await chatService.sendMessage(
        userId,
        conversationId,
        message,
        mode,
        file
      );

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getConversations(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;

      const conversations = await chatService.getConversations(userId);

      res.status(200).json({
        success: true,
        data: conversations,
      });
    } catch (error) {
      next(error);
    }
  }

  async getConversationMessages(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { conversationId } = req.params;
      
      if (!conversationId) {
        return res.status(400).json({
          success: false,
          message: 'Conversation ID is required',
        });
      }

      const conversation = await chatService.getConversationMessages(
        userId,
        conversationId
      );

      res.status(200).json({
        success: true,
        data: conversation,
      });
    } catch (error) {
      next(error);
    }
  }

  async getConversationInfo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { conversationId } = req.params;
      
      if (!conversationId) {
        return res.status(400).json({
          success: false,
          message: 'Conversation ID is required',
        });
      }

      const info = await chatService.getConversationInfo(userId, conversationId);

      res.status(200).json({
        success: true,
        data: info,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteConversation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.id;
      const { conversationId } = req.params;
      
      if (!conversationId) {
        return res.status(400).json({
          success: false,
          message: 'Conversation ID is required',
        });
      }

      await chatService.deleteConversation(userId, conversationId);

      res.status(200).json({
        success: true,
        message: 'Conversation deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new ChatController();