'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/auth';

interface HeaderProps {
  onSearch: (results: any[]) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { logout } = useAuth();
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async () => {
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/api/v1/auth/search/${query}`);
      setSearchResults(response.data);
      onSearch(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (query.trim() === '') {
      setSearchResults([]);
    }
  }, [query]);

  return (
    <header className="bg-white shadow p-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Messenger</h1>
        <div className="flex items-center space-x-4 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="p-2 border rounded"
          />
          <button onClick={handleSearch} className="bg-blue-500 text-white p-2 rounded">
            Search
          </button>
          <button onClick={logout} className="bg-red-500 text-white p-2 rounded">
            Logout
          </button>
        </div>
      </div>
      {searchResults.length > 0 && (
        <div ref={searchRef} className="absolute bg-white shadow p-2 mt-2 w-full max-w-md rounded z-10">
          <button onClick={() => setSearchResults([])} className="text-red-500 mb-2">Close</button>
          <ul>
            {searchResults.map((result: any) => (
              <li key={result._id} className="p-2 border-b">
                {result.username} - {result.email}
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
