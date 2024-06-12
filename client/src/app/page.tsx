import React from 'react';
import RootLayout from './layout';
import Messenger from './components/Messenger';

const MessengerPage: React.FC = () => {
  return (
    <RootLayout>
      <Messenger />
    </RootLayout>
  );
};

export default MessengerPage;
