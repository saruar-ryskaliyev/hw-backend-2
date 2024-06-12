// src/components/Messenger.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import { useAuth } from '../context/auth';
import { io } from 'socket.io-client';

const socket = io('http://hw-backend-2-1.onrender.com');

const Messenger: React.FC<{ users: any[] }> = ({ users }) => {
  const { user } = useAuth();
  const [currentChat, setCurrentChat] = useState<{ user1: string; user2: string } | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (user && user.username) {
      socket.emit('register_user', user.username);
    }

    socket.on('updateUserStatus', ({ username, status }) => {
      setOnlineUsers((prevOnlineUsers) => {
        if (status === 'online') {
          return [...prevOnlineUsers, username];
        } else {
          return prevOnlineUsers.filter((u) => u !== username);
        }
      });
    });

    return () => {
      socket.off('updateUserStatus');
    };
  }, [user]);

  const handleUserClick = (selectedUser: any) => {
    setCurrentChat({ user1: user.username, user2: selectedUser.username });
  };

  return (
    <div className="flex h-full">
      <div className="w-1/4 border-r border-gray-200 p-4 overflow-y-auto">
        {users.length > 0 ? (
          users.map((u) => (
            <button
              key={u._id}
              onClick={() => handleUserClick(u)}
              className="w-full text-left p-2 border-b border-gray-200 hover:bg-gray-100"
            >
              {u.username}
              {onlineUsers.includes(u.username) ? (
                <span className="ml-2 text-green-500">(online)</span>
              ) : (
                <span className="ml-2 text-gray-500">(offline)</span>
              )}
            </button>
          ))
        ) : (
          <p className="text-gray-500">No users found</p>
        )}
      </div>
      <div className="w-3/4 p-4">
        {currentChat ? (
          <Chat user1={currentChat.user1} user2={currentChat.user2} />
        ) : (
          <p className="text-gray-500">Select a user to chat with</p>
        )}
      </div>
    </div>
  );
};

export default Messenger;
