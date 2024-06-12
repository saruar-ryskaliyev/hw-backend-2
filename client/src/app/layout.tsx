// src/app/layout.tsx
'use client';

import './globals.css';
import React from 'react';
import { AuthProvider } from './context/auth';

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="flex flex-col min-h-screen bg-gray-100">
          {children}
        </body>
      </AuthProvider>
    </html>
  );
};

export default RootLayout;
