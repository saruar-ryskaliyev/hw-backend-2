'use client';

import React, { useState } from 'react';
import Messenger from '../components/Messenger';
import Header from '../components/Header';
import { useAuth } from '../context/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const MessengerPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<any[]>([]);

  useEffect(() => {
    console.log('MessengerPage useEffect:', { loading, user });

    if (!loading && !user) {
      console.log('Redirecting to /login');
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header onSearch={setSearchResults} />
      <div className="p-4">
        <Messenger />
      </div>
    </div>
  );
};

export default MessengerPage;
