// components/ChatInput.js
'use client'
import { useState, memo } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

const ChatInput = ({ onSendMessage, istyping, trackTyping }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <form className="p-4 flex xsm:max-[400px]:w-1/3 xsm:max-[400px]:p-2" onSubmit={handleSubmit}>
      <input
        type="text"
        className="flex-1 p-2 border rounded xsm:max-[400px]:min-w-[300px] xsm:max-[400px]:p-2"
        value={message}
        // onKeyDown={()=>alert('Hello')}
        
        onChange={(e) => {setMessage(e.target.value); }}
        placeholder="Type a message"
      />
      <button type="submit" className="ml-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-400">
        <FaPaperPlane />
      </button>
    </form>
  );
};

export default memo(ChatInput);
