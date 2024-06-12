import './globals.css';
import React from 'react';
import { AuthProvider } from './context/auth';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className="flex flex-col min-h-screen bg-gray-100">
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
