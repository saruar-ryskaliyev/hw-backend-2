import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '-0.32s' }}></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '-0.16s' }}></div>
      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
    </div>
  );
};

export default TypingIndicator;
