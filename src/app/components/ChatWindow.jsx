// components/ChatWindow.js
'use client'
import { useEffect, useRef, memo } from 'react';

const ChatWindow = ({ messages }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 p-4 overflow-auto">
      {messages.map((msg, index) => (
        <div key={index} className={`mb-2 p-2 ${msg.isSent ? 'text-right' : 'text-left'}`}>
          <span className={`inline-block px-4 py-2 rounded ${msg.isSent ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            {msg.text}
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default memo(ChatWindow);
