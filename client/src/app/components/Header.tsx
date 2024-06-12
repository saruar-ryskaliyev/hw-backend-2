// src/components/Header.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth';
import { io } from 'socket.io-client';


interface HeaderProps {
    onSearch: (results: any[]) => void;
}

const socket = io('http://hw-backend-2-1.onrender.com');

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
    const { logout, user } = useAuth();
    const [query, setQuery] = useState('');
    const { user: currentUser } = useAuth();

    useEffect(() => {
        if (user) {
            socket.emit('userConnected', user.username);
        }
    }, [user]);

    const handleSearch = async () => {
        if (query.trim() === '') {
            onSearch([]);
            return;
        }

        try {
            const response = await axios.get(`http://hw-backend-2-1.onrender.com/api/v1/auth/search/${query}`);
            const filteredData = response.data.filter((u: any) => u.username !== currentUser.username);

            onSearch(filteredData);
        } catch (error) {
            console.error('Search failed:', error);
            onSearch([]);
        }
    };

    return (
        <header className="bg-white shadow p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Messenger</h1>
            <div className="flex items-center space-x-4 w-full max-w-md">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="p-2 border rounded w-full"
                />
                <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">
                    Search
                </button>
                <button onClick={logout} className="bg-red-500 text-white p-2 rounded">
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
