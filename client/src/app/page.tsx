// src/app/page.tsx
'use client';

import React from 'react';
import { useAuth } from './context/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const HomePage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log('User:', user)
        router.push('/messenger');
      } else {
        router.push('/login');
      }
    }
  }, [loading, user, router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <div>Redirecting...</div>;
};

export default HomePage;
