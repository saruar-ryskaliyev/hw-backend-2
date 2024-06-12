'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import TypingIndicator from './TypingIndicator';

const socket = io('http://localhost:8000');

interface Message {
  id: string;
  text: string;
  sender: string;
}

const Messenger = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [userId, setUserId] = useState<string | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);

  useEffect(() => {
    const handleReceiveMessage = (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    }

    const handleUserTyping = (userId: string) => {
      setTypingUsers((prevTypingUsers) => [...prevTypingUsers, userId]);
    }

    const handleUserStoppedTyping = (userId: string) => {
      setTypingUsers((prevTypingUsers) => prevTypingUsers.filter(user => user !== userId));
    }

    let storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
      storedUserId = `user_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('userId', storedUserId);
    }
    setUserId(storedUserId);

    socket.emit('register_user', storedUserId);


    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('receive_message', handleReceiveMessage);

    socket.on('update_user_list', (users: string[]) => {
      setConnectedUsers(users);
    });

    socket.on('user_typing', handleUserTyping);
    socket.on('user_stop_typing', handleUserStoppedTyping);

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('receive_message', handleReceiveMessage);
      socket.off('update_user_list');
    };
  }, []);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      socket.emit('typing', userId);
    } else {
      socket.emit('stop_typing', userId);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const sendMessage = () => {
    if (message.trim() && userId) {
      const newMessage: Message = { id: new Date().toISOString(), text: message, sender: userId };
      socket.emit('send_message', newMessage);
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage('');
      socket.emit('stop_typing', userId);
    }
  };

  const isUserOnline = (userId: string | null) => {
    return userId && connectedUsers.some(user => user !== userId);
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-5xl font-bold mb-4">Messenger</h1>
        <p className="mb-4 text-gray-600">Status: {isUserOnline(userId) ? 'Online' : 'Offline'}</p>
        <div className="flex flex-col mb-4 h-80 overflow-y-auto border p-4 rounded-md bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`mb-2 flex ${msg.sender === userId ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-2 rounded-lg ${msg.sender === userId ? 'bg-red-500 text-white' : 'bg-gray-200 text-black'}`}>
                <span className="font-semibold">{msg.sender === userId ? 'Me' : msg.sender}</span>: {msg.text}
              </div>
            </div>
          ))}
          {typingUsers.length > 0 && (
            <div className="flex justify-start">
              <TypingIndicator />
            </div>
          )}
        </div>
        <div className="flex items-center">
          <input
            className="flex-1 p-2 border rounded-md mr-2"
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
          />
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
