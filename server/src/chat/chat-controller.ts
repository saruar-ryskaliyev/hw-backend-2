import { Request, Response } from 'express';
import ChatService from './chat-service';

interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

class ChatController {
  async getChatHistory(req: AuthRequest, res: Response): Promise<void> {
    const { user1, user2 } = req.params;
    const { username } = req.user!;

    if (username !== user1 && username !== user2) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    try {
      const messages = await ChatService.getChatHistory(user1, user2);
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving chat history', error });
    }
  }

  async sendMessage(req: AuthRequest, res: Response): Promise<void> {
    const { sender, receiver, message } = req.body;
    const { username } = req.user!;

    if (username !== sender) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    try {
      const savedMessage = await ChatService.saveMessage(sender, receiver, message);
      res.status(201).json(savedMessage);
    } catch (error) {
      res.status(500).json({ message: 'Error sending message', error });
    }
  }

  async deleteMessage(req: AuthRequest, res: Response): Promise<void> {
    const { messageId } = req.params;
    const { username } = req.user!;

    try {
      const message = await ChatService.getMessageById(messageId);
      if (!message) {
        res.status(404).json({ message: 'Message not found' });
        return;
      }

      if (message.sender !== username) {
        res.status(403).json({ message: 'Access denied' });
        return;
      }

      await ChatService.deleteMessage(messageId);
      res.status(200).json({ message: 'Message deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting message', error });
    }
  }

  async getRecentConversations(req: AuthRequest, res: Response): Promise<void> {
    const { user } = req.params;
    const { username } = req.user!;

    if (username !== user) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    try {
      const recentConversations = await ChatService.getRecentConversations(user);
      res.status(200).json(recentConversations);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving recent conversations', error });
    }
  }
}

export default new ChatController();
