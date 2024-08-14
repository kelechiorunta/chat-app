// components/ChatWindow.js
'use client'
import { useEffect, useRef, memo, useContext } from 'react';
import useAuth from '@/custom_hooks/useAuth';
import { authContext } from './AuthComponent';
import { motion } from 'framer-motion';

const ChatWindow = ({ messages, signedUser, selectedUser }) => {
  const {activeuser} = useAuth()
  const {onlineUsers} = useContext(authContext)
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getUserName = (id) => {
    const searchedUser = onlineUsers && onlineUsers.find(user=>{return user.userId==id})
    if (searchedUser){
      const { nickname, name } = searchedUser
      return nickname || name
    }
  }

  const getUserPicture = (id) => {
    const searchedUser = onlineUsers && onlineUsers.find(user=>{return user.userId==id})
    if (searchedUser){
      const { picture } = searchedUser
      return picture//nickname || name
    }
  }

  return (
    <motion.div 
    className="flex-1 p-4 overflow-auto bg-black text-white xsm:max-lg:overflow-visible">

      {selectedUser && <h1 className='text-[#3b82f6] text-center shadow-indigo-500 rounded-md p-4 bg-white font-bold '>{`${activeuser && activeuser.displayName.toUpperCase()} connects with ${selectedUser && selectedUser.nickname.toUpperCase()}`}</h1>}
      {/* {messages && <h1 className='text-[#3b82f6] text-center shadow-indigo-500 rounded-md p-4 bg-white font-bold '>{messages && messages[messages.length-1].timestamp}</h1>} */}
      {messages && messages.map((msg, index) => (
        <div key={index} 
        className={`flex ${msg.senderId === (activeuser && activeuser.uid) ? 'justify-end' : 'justify-start'} mb-2  border-y-gray-400 border-x-0 py-4`}>
        {/* // className={`mb-2 p-2 flex ${msg.senderId == activeuser && activeuser.uid ? 'justify-end' : 'justify-start'} `}> */}
          {/* ${msg.isSent ? 'text-right' : 'text-left'}` */}
          <span className={`inline-block px-4 py-2 rounded ${msg.senderId === (activeuser && activeuser.uid) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
          <div className=''>
          {msg.senderId === (activeuser && activeuser.uid) ? <div className='flex flex-row-reverse gap-x-2 items-center'><img src={activeuser && activeuser.photoURL} width={50} height={50} className='w-[50px] h-[50px] rounded-full' alt='S'/> <small className='italic'>{activeuser && activeuser.displayName}</small> </div>
              :  <div className='flex gap-x-2 items-center'><img src={getUserPicture(msg.senderId)} width={50} height={50} className='w-[50px] h-[50px] rounded-full' alt='R'/> <small className='italic'>{getUserName(msg.senderId)}</small></div>} 
            {msg.istyping==true? 'Typing' : `${msg.text}`}
            {/* ORIGINALLY I Refrenced SELECTEDUSER(picture for the image && nickname for the name in italics). REVERT TO THIS IF ISSUES ARISE */}
          </div>
          </span>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </motion.div>
  );
};

export default memo(ChatWindow);
