// components/Connects.js
'use client'
import { useCallback, useEffect, useState, useContext, memo } from 'react';
import { FaUserAlt, FaFilter, FaCircle } from 'react-icons/fa';
import useUsers from '../firebase/hook/useUsers';
import Image from 'next/image';
import { collection, getDoc, getDocs, onSnapshot, setDoc, where, query, orderBy, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { doc } from 'firebase/firestore';
import { authContext } from './AuthComponent';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Connects = ({others, setOthers, setSelectedUser, notify, setNotify, animate_user}) => {
  const userContext = useContext(authContext)
  const {active, setOnlineUsers} = userContext
  const { users } = useUsers();
  const [filter, setFilter] = useState('all');
  // const [others, setOthers] = useState([])
  const [connects, setConnects] = useState([])
  const [onlineId, setOnlineId] = useState(null)
  const [isActive, setisActive] = useState(false)
  
  // const [filteredUsers, setFilteredUsers] = useState([])

  const parentVariants = {
    hidden:{x:'-100%', opacity:0},
    visible:{x:0, opacity:1, transition: {staggerChildren:2.5}}
  }

  const userVariants = {
    hidden:{x:'-100%', opacity:0},
    visible:{x:0, opacity:1, },
    
  }

  const fetchUsers = useCallback(() => {
    if (users && users.length>0){
      setOthers(others)
    }   
  }, [users])

  const getUserName = (id) => {
    const searchedUser = users && users.find(user=>{return user.id==id})
    if (searchedUser){
      const { userdata } = searchedUser
      const { nickname, name } = userdata
      return nickname || name
    }
  }
  
  const trackActivity = useCallback(async() => {

      console.log(active)
      console.log(users && users)
      

    users && users.forEach(async(user) => {

      setOthers(users && users.map((user, index)=>(user.userdata)))
      /////////////////////////////////////////// To alert user of any unread messages
      const mergedIds = [`${active && active.uid}`, `${user && user.id}`].sort().join('_');
      console.log(mergedIds)
    
      const messagesCollection = collection(db, 'chats', mergedIds, 'messages');
      const q = query(messagesCollection, orderBy('timestamp'));
      const unsubscribeMessages = onSnapshot(q, async(snapshot) => {
        if (snapshot){
          // const messagesData = snapshot.docs.map((doc) => doc.data());
          const messagesData = snapshot.docs.map((doc) => {
            const messageData = doc.data();
      
            if (!messageData.isRead) {
              // Update only the isRead property and merge with existing data
              console.log(getUserName(messageData && messageData.senderId))
              setNotify(`You have some unread message from ${getUserName(messageData && messageData.senderId)}`)
              updateDoc(doc.ref, { isRead: true }, { merge: true });
            }
            // else{
            //   setNotify('No new messages')
            // }
            return messageData;
          
          });
          
          // setMessages(messagesData);
        }
      })
      ///////////////////////////////////////////
      const onlineRef = query(
        collection(db, 'users'),
        // where('userdata.isOnline', '==', true)
      );
      
      const unsubscribeOnlineUsers = onSnapshot(onlineRef, async (snapshot) => {
        if (snapshot) {
          let onlineUsers = [];
          snapshot.forEach((doc) => {
            const userData = doc.data().userdata;
            onlineUsers.push(userData);
      
            if (userData && userData.isOnline === true) {
              setOnlineId(userData.userId);
              setisActive(true);
              updateDoc(doc.ref, { "userdata.isOnline": true }, { merge: true });
            } 
          });
      
          console.log(onlineUsers);
          setOnlineUsers(onlineUsers.filter(user=>{return user.userId != (active && active.uid)}))
          setOthers(onlineUsers.filter(user=>{return user.userId != (active && active.uid)}))
        }
      });
    
        
          
               return () => {
                    unsubscribeOnlineUsers();
                    unsubscribeMessages();
                }

})


    
  }, [users, onlineId, isActive, auth])

  useEffect(()=>{
    fetchUsers()
  },[users])

  useEffect(()=>{  
      trackActivity()
  }, [users, auth, isActive])

  // const cacheFilteredUsers = useCallback(()=>{
    const filteredUsers = others && others.filter(user =>
      filter === 'all' ? true : user.gender === filter
    
   )
  // }, [filteredUsers, others])

  // useEffect(()=>{
  //   cacheFilteredUsers()
  // }, [filteredUsers]);

  const handleFilterChange = (gender) => {
    setFilter(gender);
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 h-max">
      <div className="flex justify-between items-center mb-4">
        <h1 className="styleConnect text-xl font-bold text-gray-700 dark:text-gray-300 xsm:max-[400px]:hidden">Let's Connect</h1>
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <button onClick={() => handleFilterChange('all')} className={`px-4 py-1 ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} rounded-md`}>All</button>
          <button onClick={() => handleFilterChange('male')} className={`px-4 py-1 ${filter === 'male' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} rounded-md`}>Male</button>
          <button onClick={() => handleFilterChange('female')} className={`px-4 py-1 ${filter === 'female' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} rounded-md`}>Female</button>
        </div>
      </div>

      {
      <motion.div 
        initial='hidden'
          animate='visible'
          variants={{visible: {
            opacity: 1,
            x: 0,
            transition: {
              staggerChildren:2.5,
            },
          }, hidden: { opacity: 0, x:20}, }}
      className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {console.log(filteredUsers)}
        {filteredUsers && filteredUsers.map(user => {
        
        return ( 
          
          <motion.div
          key={user.userId}
           initial='hidden'
          animate='visible'
         
          className="bg-gray-700 text-white dark:bg-gray-700 p-4 rounded-md shadow-md flex items-center w-full">
            <motion.div
            variants={{
              visible: { opacity: 1, x:0},
              hidden: { opacity: 0, x:20},
            }}
            onClick={()=>{setSelectedUser(user); setNotify('No new messages');}}
            className='w-max h-max rounded-full border-white border-2 hover:cursor-pointer'>
            {/* // href={'/login'}> */}
              <img
                src={user.picture||URL.createObjectURL(user.picture) }
                alt={user.name}
                className="rounded-full w-[70px] h-[50px]"
                width={50}
                height={50}
              />
            </motion.div>
            <div className="ml-4 w-full pr-10">
              <h2 className="text-lg font-bold text-gray-300 dark:text-gray-200">{user.name}</h2>
              {/* <p className="text-gray-600 dark:text-gray-400 w-full">{user.email}</p> */}
              <p className="text-sm text-gray-300 dark:text-gray-400">{user.nickname}</p>
              <div className="flex items-center gap-2">
                
                <FaCircle className={`w-3 h-3 ${onlineId && isActive && (user.isOnline == true) ? 'text-green-500' : 'text-gray-400'}`} />
                
                <p className={`text-sm ${onlineId && isActive && (user.isOnline == true)?  'text-gray-100' :  'text-gray-500' } dark:text-gray-400`}>
                  {onlineId && isActive && (user.isOnline == true)? 'Online' : 'Offline'}
                </p>
                
              </div>
            </div>
          </motion.div>
)})}    
      </motion.div>}
      {!notify.includes('undefined') && <small className='uppercase'>{notify && !notify.includes('undefined') && notify || 'No new messages'}</small>}
    </div>
  );
};

export default memo(Connects);

  