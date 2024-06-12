// src/components/Chat.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { useAuth } from '../context/auth';
import TypingIndicator from './TypingIndicator';

interface ChatProps {
  user1: string;
  user2: string;
}

const socket = io('http://localhost:8000');

const Chat: React.FC<ChatProps> = ({ user1, user2 }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [user2Status, setUser2Status] = useState('offline');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/v1/chat/history/${user1}/${user2}`);
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      }
    };

    fetchChatHistory();

    socket.emit('requestOnlineStatus', [user1, user2]);

    socket.on('chat message', (message) => {
      if (
        (message.sender === user1 && message.receiver === user2) ||
        (message.sender === user2 && message.receiver === user1)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socket.on('typing', ({ sender, receiver }) => {
      if (receiver === user.username) {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 3000); // Reset typing indicator after 3 seconds
      }
    });

    socket.on('updateUserStatus', ({ username, status }) => {
      if (username === user2) {
        setUser2Status(status);
      }
    });

    return () => {
      socket.off('chat message');
      socket.off('typing');
      socket.off('updateUserStatus');
    };
  }, [user1, user2, user.username]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    const message = {
      sender: user.username,
      receiver: user2,
      message: newMessage,
    };

    try {
      await axios.post('http://localhost:8000/api/v1/chat/send', message);
      socket.emit('chat message', message);
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    socket.emit('typing', { sender: user.username, receiver: user2 });
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`http://localhost:8000/api/v1/chat/delete/${messageId}`);
      setMessages((prevMessages) => prevMessages.filter((message) => message._id !== messageId));
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 border border-gray-200 rounded-lg mb-4" ref={chatRef}>
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-bold">{user2}</h2>
          <span className={`ml-2 text-sm ${user2Status === 'online' ? 'text-green-500' : 'text-gray-500'}`}>
            ({user2Status})
          </span>
        </div>
        {messages.map((message) => (
          <div key={message._id || message.timestamp} className="mb-2">
            <p className="font-bold">{message.sender}:</p>
            <p>{message.message}</p>
            <small className="text-gray-500">{new Date(message.timestamp).toLocaleString()}</small>
            {message.sender === user.username && (
              <button
                onClick={() => handleDeleteMessage(message._id)}
                className="text-red-500 ml-2"
              >
                Delete
              </button>
            )}
          </div>
        ))}
        {isTyping && <TypingIndicator />}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded mr-2"
        />
        <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
