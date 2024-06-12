import ChatMessageModel, { IChatMessage } from './models/ChatMessage';
import UserModel from '../auth/models/User';

class ChatService {
  async saveMessage(senderUsername: string, receiverUsername: string, message: string): Promise<IChatMessage> {
    const sender = await UserModel.findOne({ username: senderUsername });
    const receiver = await UserModel.findOne({ username: receiverUsername });

    if (!sender || !receiver) {
      throw new Error('Sender or receiver does not exist');
    }

    const newMessage = new ChatMessageModel({
      sender: senderUsername,
      receiver: receiverUsername,
      message,
    });

    await newMessage.save();
    return newMessage;
  }

  async getChatHistory(user1Username: string, user2Username: string): Promise<IChatMessage[]> {
    return ChatMessageModel.find({
      $or: [
        { sender: user1Username, receiver: user2Username },
        { sender: user2Username, receiver: user1Username },
      ],
    }).sort({ timestamp: 1 });
  }

  async getMessageById(messageId: string): Promise<IChatMessage | null> {
    return ChatMessageModel.findById(messageId);
  }

  async deleteMessage(messageId: string): Promise<void> {
    await ChatMessageModel.findByIdAndDelete(messageId);
  }

  async getRecentConversations(username: string): Promise<IChatMessage[]> {
    return ChatMessageModel.aggregate([
      { $match: { $or: [{ sender: username }, { receiver: username }] } },
      { $group: { _id: { $ifNull: ['$sender', '$receiver'] }, lastMessage: { $last: '$$ROOT' } } },
      { $sort: { 'lastMessage.timestamp': -1 } },
    ]);
  }
}

export default new ChatService();
