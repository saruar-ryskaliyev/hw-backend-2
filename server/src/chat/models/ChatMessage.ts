import mongoose, { Document, Schema } from 'mongoose';

export interface IChatMessage extends Document {
  sender: string;
  receiver: string;
  message: string;
  timestamp: Date;
}

const ChatMessageSchema: Schema = new Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema);
