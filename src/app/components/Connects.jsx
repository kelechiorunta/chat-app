// components/Connects.js
'use client'
import { useCallback, useEffect, useState, useContext, memo } from 'react';
import { FaUserAlt, FaFilter, FaCircle, FaEnvelope } from 'react-icons/fa';
import useUsers from '../firebase/hook/useUsers';
import Image from 'next/image';
import { collection, getDoc, getDocs, onSnapshot, setDoc, where, query, orderBy, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { doc } from 'firebase/firestore';
import { authContext } from './AuthComponent';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import BallObject from './BallObject';

const Connects = ({others, setOthers, setSelectedUser, selectedUser, notify, setNotify, animate_user}) => {
  const userContext = useContext(authContext)
  const {setPrev, active, setFormerUser, setUnreadMsg, setOnlineUsers, setSender, sender} = userContext
  const { users } = useUsers();
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  // const [others, setOthers] = useState([])
  const [connects, setConnects] = useState([])
  const [onlineId, setOnlineId] = useState(null)
  const [isActive, setisActive] = useState(false)
  const [notifiers, setNotifiers] = useState(null)
  const [selectedId, setSelected] = useState(null)
  
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

      const activeUserRef = doc(db, 'users', active && active.uid)
      const activeSnapshot = await getDoc(activeUserRef)
      if (activeSnapshot){
        const unsubNotifiers = onSnapshot(activeUserRef, (snapshot) => {
          const data = snapshot.data();
          console.log(data)
          const { userdata } = data
          const {notification} = userdata
          setNotifiers(notification)
        })

       
        
      }
      

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
              setSender(messageData && messageData.senderId)
              setNotify(`You have some unread message from ${getUserName(messageData && messageData.senderId)}`)
              updateDoc(doc.ref, { isRead: true }, { merge: true });
            }
            
            // setUnreadMsg(0)
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
                    unsubNotifiers()           }

})
  }, [users, onlineId, isActive, auth, selectedUser, sender,])

  useEffect(()=>{
    fetchUsers()
  },[users])

  useEffect(()=>{  
      trackActivity()
  }, [users, auth, isActive,])

  const getNotificationSenders = (user, arr_notifiers) => {
     const currentNotification =  arr_notifiers && arr_notifiers.find(user_notifier=>{return user_notifier.sender == user.userId})
        if (currentNotification){
          return currentNotification.sender
        }
    }

    const getNotificationUnRead = (user, arr_notifiers) => {
      const currentNotification =  arr_notifiers && arr_notifiers.find(user_notifier=>{return user_notifier.sender == user.userId})
         if (currentNotification){
           return currentNotification.unRead
         }
     }

    const clearNotifications = async(user) => {
      if (user){
        // const senderRef = doc(db, 'users', sender);
        const activeRef = doc(db, 'users', active && active.uid);
        const snapshot = await getDoc(activeRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        var notificationUnread = data.userdata?.notification || [];

        if (notificationUnread){
          const updatedNotifications = notificationUnread.filter(n => n.sender !== user.userId)
          notificationUnread = updatedNotifications;
          const sendersSet = new Set(notificationUnread.map(JSON.stringify)); // Convert to strings to ensure uniqueness
          const uniqueNotifications = Array.from(sendersSet).map(JSON.parse); // Convert back to objects

          await updateDoc(activeRef, {
            "userdata.notification": uniqueNotifications,
          }, { merge: true });
        }
        
      }       
          }
     }

  // const cacheFilteredUsers = useCallback(()=>{
    const getOthers = (arr, sliceNo) => {
      return arr && arr.slice(sliceNo*3, (sliceNo+1)*3)
    }

    const filteredUsers = getOthers(others.slice().sort((a,b)=>a.nickname.localeCompare(b.nickname)), 0) 
    && getOthers(others.slice().sort((a,b)=>a.nickname.localeCompare(b.nickname)),0).filter(user =>
      filter === 'all' ? true : user.gender === filter
    
   )

  const handleFilterChange = (gender) => {
    setFilter(gender);
  };

  const handlePaginate = useCallback((arr, sliceNo) => {
    const paginatedArray = arr && arr.slice(sliceNo*3, (sliceNo+1)*3)
    setOthers(paginatedArray)
    setSelected(sliceNo)
  }, [others, selectedId, filteredUsers, onlineId, isActive])


  // const paginatedfilteredArray = (arr) => {
  //   if (arr){
  //     handlePaginate(arr, 0)
  //   }
  // }

  useEffect(()=>{
    setSelected(0)
  },[])

  return (
    <div className="p-4 rounded-md bg-gradient-conic from-40%  from-white via-slate-800 to-slate-100 dark:bg-gray-800 h-max min-h-[540px] w-[100%] xsm:max-md:w-full">
      <div className="flex justify-between items-center mb-4">
        {/* <h1 className="styleConnect text-xl font-bold text-gray-700 dark:text-gray-300 uppercase xsm:max-[400px]:hidden">Let's Connect</h1> */}
        {/* <div className='w-auto'><BallObject ballsize={'50px'} bounce_height={10}/></div> */}
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
      className="w-full grid grid-cols-1 xsm:max-md:grid-cols-1 lg:grid-cols-1 gap-x-4 gap-y-2 xsm:max-md:w-full">
        {console.log(filteredUsers)}
        {filteredUsers && filteredUsers.map((user, index) => {
        
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
            onClick={()=>{setSelectedUser(user); setUnreadMsg(0); setNotify('No new messages'); clearNotifications(user); setPrev(user); router.prefetch(`/chatpage/${user.nickname}`)}}
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
              <h2 className=" font-bold text-gray-300 dark:text-gray-200 xsm:max-[400px]:text-[15px]">{user.name}</h2>
              {/* <p className="text-gray-600 dark:text-gray-400 w-full">{user.email}</p> */}
              {/* <p className="text-sm text-gray-300 dark:text-gray-400">{user.nickname}</p> */}
              <p className="text-sm float-right ml-16 text-gray-300 dark:text-gray-400 xsm:max-sm:float-none xsm:max-sm:ml-0">{user && user.time? user?.time.toDate().toLocaleTimeString() : ''}</p>
              <div className="flex items-center gap-2">
                
                <FaCircle className={`w-3 h-3 ${onlineId && isActive && (user.isOnline == true) ? 'text-green-500' : 'text-gray-400'}`} />
                
                <p className={`text-sm ${onlineId && isActive && (user.isOnline == true)?  'text-gray-100' :  'text-gray-500' } dark:text-gray-400`}>
                  {onlineId && isActive && (user.isOnline == true)? 'Online' : 'Offline'}
                </p>
                
              </div>

              <div
              onClick={()=>{clearNotifications(user); setSelectedUser(user)}}
              className='flex items-center gap-x-2 hover:cursor-pointer'>
                {console.log(notifiers)}
                <FaEnvelope fill={(user.userId==getNotificationSenders(user,notifiers)) && (getNotificationUnRead(user, notifiers) > 0)? 'red':'gray' } size={20} />
                {(user.userId==getNotificationSenders(user,notifiers)) && (getNotificationUnRead(user, notifiers) > 0) ? <small className='uppercase text-white'>{`${(user.userId==getNotificationSenders(user,notifiers)) && (getNotificationUnRead(user, notifiers))} unread ${(getNotificationUnRead(user, notifiers) > 1)? 'messages':'message'}`}</small> : null}
              </div>
            </div>
          </motion.div>
)})}    
      </motion.div>}
      <ul className='flex gap-x-2 bg-gradient-to-br from-gray-300 via-zinc-500
       to-slate-400 p-4 rounded-md w-max text-white mt-2'>
        {Array.from({length:Math.ceil(users.length/3)}, (v, item) => item + 1).map((i, index) => {
          return(
            <button
            onClick={()=>handlePaginate(users && users.map((user, index)=>(user.userdata)), index)}
            className={`${selectedId==index && 'selected'} flex items-center justify-center  p-2 w-[30px] h-[30px] rounded-full`}>
              {index + 1}
            </button>
          )
        })}
      </ul>
      {/* {!notify.includes('undefined') && <small className='uppercase'>{notify && !notify.includes('undefined') && notify || 'No new messages'}</small>} */}
    </div>
  );
};

export default memo(Connects);

  