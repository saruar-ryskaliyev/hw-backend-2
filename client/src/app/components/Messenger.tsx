'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useAuth } from '../context/auth';
import { User, Message } from '../types'

const socket = io('http://localhost:8000');

const Messenger = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {


    axios.get('http://localhost:8000/api/v1/auth/search/query')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Failed to fetch users:', error));

    socket.on('message', (newMessage: Message) => {
      setMessages(prevMessages => [...prevMessages, newMessage]);
    });


    console.log(users)
    console.log(user)

    return () => {
      socket.off('message');
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim()) {
      socket.emit('message', { content: message, user });
      setMessage('');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-1/4 p-4 bg-white border-r">
        <h2 className="text-lg font-bold mb-4">Users</h2>
        <ul>
          {users.map(user => (
            <li key={user._id} className="mb-2">{user.username}</li>
          ))}
        </ul>
      </div>
      <div className="w-3/4 p-4 flex flex-col">
        <div className="flex-1 overflow-y-scroll bg-white p-4 border rounded">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <strong>{msg.user.username}: </strong>
              <span>{msg.content}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex">
          <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} className="flex-1 p-2 border rounded mr-2" />
          <button onClick={handleSendMessage} className="bg-blue-500 text-white p-2 rounded">Send</button>
        </div>
      </div>
    </div>
  );
};

export default Messenger;
