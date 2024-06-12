'use client';

import React from 'react';
import Messenger from '../components/Messenger';
import { useAuth } from '../context/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const MessengerPage: React.FC = () => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return <Messenger />;
};

export default MessengerPage;
