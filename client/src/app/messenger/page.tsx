// src/app/messenger/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Messenger from '../components/Messenger';
import Header from '../components/Header';
import { useAuth } from '../context/auth';
import { useRouter } from 'next/navigation';

const MessengerPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    console.log('MessengerPage useEffect:', { loading, user });

    if (!loading && !user) {
      console.log('Redirecting to /login');
      router.push('/login');
    }
  }, [loading, user, router]);

  const handleSearchResults = (results: any[]) => {
    setUsers(results);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={handleSearchResults} />
      <div className="p-4 h-full">
        <Messenger users={users} />
      </div>
    </div>
  );
};

export default MessengerPage;
