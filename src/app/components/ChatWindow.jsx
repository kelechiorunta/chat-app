// components/ChatWindow.js
'use client'
import { useEffect, useRef, memo, useContext, useCallback, useState } from 'react';
import useAuth from '@/custom_hooks/useAuth';
import { authContext } from './AuthComponent';
import { motion } from 'framer-motion';
import Modal from './Modal';
import MyChatPage from '../@chatty/chatpage/[...id]/page';
import DashboardLayout from '../dashboard/layout';
import { collection, updateDoc, query, doc, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const ChatWindow = ({signedUser, selectedUser, setSelectedUser }) => {
  const {activeuser} = useAuth()
  const {messages, setMessages, setmessages, prev, setPrev, onlineUsers, sender, setSender, session, setSession} = useContext(authContext)
  const messagesEndRef = useRef(null);
  const [filteredMessages, setFilteredMessages] = useState(messages && messages)
  const [notification, setNotification] = useState(false)
  // const [sender, setSender] = useState(null)
  // const [acceptedIds, setAcceptedIds] = useState('')

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedUser, sender, notification, filteredMessages]);

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

  const getSender = (id) =>{
    const sender = onlineUsers && onlineUsers.filter((user,index) => {return (user.userId==id ) && index})
    return sender && sender
  }

  const handleSelect = (user) =>{
    setSelectedUser(user)
  }

  // useEffect(()=>{
  //   setFilteredMessages(messages)
  // },[])

  

  const Notification = ({notifier, setSender, sender, getSender, getUserName, setSelectedUser, activeuser, onlineUsers, setNotification}) => {     

    var acceptedIds;

    const accept = (sender, isAccepted) => {
      if ((sender && (sender !== (selectedUser && selectedUser.userId))) && (sender && (sender !== (activeuser && activeuser.uid)))){
        console.log(sender)
        if (isAccepted){
          setSelectedUser(onlineUsers[getSender(sender && sender).length]); setPrev(onlineUsers[getSender(sender && sender).length]);
          acceptedIds = ([`${activeuser && activeuser.uid}`, `${sender && sender}`].sort().join('_'));
        }
        else{
          setSelectedUser(onlineUsers[getSender(selectedUser && selectedUser.userId).length]); setPrev(onlineUsers[getSender(selectedUser && selectedUser.userId).length]); 
          acceptedIds = ([`${activeuser && activeuser.uid}`, `${selectedUser && selectedUser.userId}`].sort().join('_'));
        }
        
        const fallbackIds = [`${activeuser && activeuser.uid}`, `${selectedUser && selectedUser.userId}`].sort().join('_');
        console.log(acceptedIds)
        const messagesCollection = collection(db, 'chats', acceptedIds, 'messages');
        const q = query(messagesCollection, orderBy('timestamp'));
        const unsubscribeMessages = onSnapshot(q, async(snapshot) => {
        const data = []
          if (snapshot){
            const messagesData = snapshot.docs.map((doc) => {
              const messageData = doc.data();
              data.push(messageData)
              if (!messageData.isOnline) {
                // Update only the isRead property and merge with existing data
                updateDoc(doc.ref, { isOnline: true }, { merge: true });
              }
              return messageData;
            });

            console.log(data)
            setMessages(data)
            setFilteredMessages(data);
            
          }

          return () => unsubscribeMessages()

        })
      }
    }
/////////
return(
  // <Modal isOpen={true}>
  <div className='bg-red-200 rounded-xl p-4 flex flex-col w-max text-black slideIn'>
  
    {/* <h1 className=' bg-green text-blac'>{`${notifier && notifier} likes to code`}</h1> */}
    
    <h1 className='italic py-2'>{`${getUserName(sender && sender)} is tying to connect `}</h1>
    {/* {accept_Sender()} */}
    <div className='flex gap-x-4'>
    <button className='uppercase shadow-xl rounded-md p-2 bg-white' onClick={()=>{accept(sender && sender, true); setNotification(false); setSender(null)}}>Accept</button>
    <button className='uppercase shadow-xl rounded-md p-2 bg-white' onClick={()=>{accept(sender && sender, false); setNotification(false); setSender(null); }}>Ignore</button>
    </div>
  </div>
  // </Modal>
)
  }

    


  // To notify chatters (current sender and reciever) of third party connect/sender  
  const notifyChatters = (sender)=>{
    if ((sender && (sender !== (selectedUser && selectedUser.userId))) && (sender && (sender !== (activeuser && activeuser.uid)))){
      //  alert('Hold on')
       setNotification(true)
      ///ALERT OF INCOMING THIRD PARTY SENDER
    //    else {
    //   setNotification(false)
    // }
  }
}
  
  
  useEffect(()=>{
    if ((sender && (sender !== (selectedUser && selectedUser.userId))) && (sender && (sender !== (activeuser && activeuser.uid)))){
      notifyChatters(sender)
    } 
    else{
      if ((sender && (sender !== (selectedUser && selectedUser.userId))) && (sender && (sender !== (activeuser && activeuser.uid)))){
        setFilteredMessages(filteredMessages)
      }else{
        setFilteredMessages(messages)
      }
     
    }
    console.log(filteredMessages)
  },[notification, sender, selectedUser, messages, filteredMessages, activeuser])

  return (
    <motion.div
      initial='hidden'
      animate='visible'
      variants={{visible: {
            opacity: 1,
            x: 0,
            transition: {
              staggerChildren:0.0151,
              // duration: 2,
            },
          }, hidden: { opacity: 0, x:'0'}, }}
    className="flex-1 p-4 overflow-auto bg-black text-white xsm:max-lg:overflow-visible">
        {/* <MyChatPage/> */}
          {/* <MyChatPage params={{id: selectedUser && selectedUser.nickname}}/> */}
          {/* <DashboardLayout/> */}
        <p className='text-white'>{`${activeuser && activeuser.displayName} connects with ${selectedUser && selectedUser.nickname}`}</p>
      { notification  ? <Notification
                          sender={sender}
                          getUserName={getUserName}
                          onlineUsers={onlineUsers}
                          activeuser={activeuser}
                          selectedUser={selectedUser}
                          // setAcceptedIds={setAcceptedIds}
                          setNotification={setNotification}
                          setSender={setSender}
                          getSender={getSender}
                          setSelectedUser={setSelectedUser}/>
                          
        :
      filteredMessages && filteredMessages.map((msg, index) => (
      
        <motion.div
          variants={{
            visible: { opacity: 1, x:0, transition: {
              stagger:0.2,
            },},
            hidden: { opacity: 0, x: 20},
          }}
          key={index} 
          className={`flex ${msg.senderId === (activeuser && activeuser.uid) ? 'justify-end' : 'justify-start'} mb-2  border-y-gray-400 border-x-0 py-4`}>
        {/* // className={`mb-2 p-2 flex ${msg.senderId == activeuser && activeuser.uid ? 'justify-end' : 'justify-start'} `}> */}
          {/* ${msg.isSent ? 'text-right' : 'text-left'}` */}
          <span className={`inline-block px-4 py-2 rounded ${msg.senderId === (activeuser && activeuser.uid) ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
          <motion.div 
            variants={{
              visible: { opacity: 1, x:0},
              hidden: { opacity: 0, x:'-100%'},
              
            }}
            className=''>
          {msg.senderId === (activeuser && activeuser.uid) ? <div className='flex flex-row-reverse gap-x-2 items-center'><img src={activeuser && activeuser.photoURL} width={50} height={50} className='w-[50px] h-[50px] rounded-full' alt='S'/> <small className='italic'>{activeuser && activeuser.displayName}</small> </div>
              :  <div className='flex gap-x-2 items-center'><img src={(selectedUser && selectedUser.picture)} width={50} height={50} className='w-[50px] h-[50px] rounded-full' alt='R'/> <small className='italic'>{(selectedUser && selectedUser.nickname)}</small></div>} 
            {msg.istyping==true? 'Typing' : `${msg.text}`}
            {/* ORIGINALLY I Refrenced SELECTEDUSER(picture for the image && nickname for the name in italics). REVERT TO THIS IF ISSUES ARISE */}
            {/* {(msg.senderId != selectedUser && selectedUser.userId) && trackInterceptingUser(msg.senderId)} */}
            {/* {sender && trackInterceptingUser(msg.senderId)} */}
            {/* (msg.senderId == selectedUser && selectedUser.userId) &&  */}
          </motion.div>
           
          </span>
          
        </motion.div>
       
      ))
    }

      

    
      
      <div ref={messagesEndRef} />
      
    </motion.div>
  );
}

export default memo(ChatWindow);
