import { Router } from 'express';
import ChatController from './chat-controller';
import { authMiddleware } from '../middlewares/auth-middleware';

const chatRouter = Router();

chatRouter.get('/history/:user1/:user2', authMiddleware ,ChatController.getChatHistory);
chatRouter.post('/send', authMiddleware, ChatController.sendMessage);
chatRouter.delete('/delete/:messageId', authMiddleware, ChatController.deleteMessage);
chatRouter.get('/recent/:user', authMiddleware, ChatController.getRecentConversations);

export default chatRouter;
