// components/Connects.js
'use client'
import { useCallback, useEffect, useState, useContext, memo } from 'react';
import { FaUserAlt, FaFilter, FaCircle } from 'react-icons/fa';
import useUsers from '../firebase/hook/useUsers';
import Image from 'next/image';
import { collection, getDoc, onSnapshot, setDoc, where, query } from 'firebase/firestore';
import { db, auth } from '../firebase/config';
import { doc } from 'firebase/firestore';
import { authContext } from './AuthComponent';

const Connects = () => {
  const userContext = useContext(authContext)
  const {active} = userContext
  const {users} = useUsers();
  const [filter, setFilter] = useState('all');
  const [others, setOthers] = useState([])
  const [connects, setConnects] = useState([])
  const [isAvail, setisAvail] = useState(false)
  const [isUnAvail, setisUnAvail] = useState(false)
  const [onlineId, setOnlineId] = useState(null)
  const [offlineId, setOfflineId] = useState(null)

  const trackActivity = useCallback(async() => {

    setOthers(users.map((user, index)=>(user.userdata)))
      console.log(active)
      console.log(users && users)

    users && users.forEach(async(user) => {
      // const userRef = query(doc(db, 'users', user.id), where('userdata.isOnline', '==', true ))
      const onlineRef = query(
        collection(db, 'users'),
        where('userdata.isOnline', '==', true),
        // where('userdata.userId', '!=', user.id)
      );

      const offlineRef = query(
        collection(db, 'users'),
        where('userdata.isOnline', '==', false),
        // where('userdata.userId', '==', user.id)
      );
      
          const unsubscribeOnlineUsers = onSnapshot(onlineRef, async(snapshot) => {
        
          if (snapshot){
                alert(`${user.id},'real user'`)
                setOnlineId(user.id)
                setisAvail(true); 
                setisUnAvail(false); 
            }
            // else{
            //   setOnlineId(null)
            // }
            
          })

          const unsubscribeOfflineUsers = onSnapshot(offlineRef, async(snapshot) => {
        
            if (snapshot){
              // alert(`${user.id} just logged out}`)
                  setOfflineId(user.id)
                  setOnlineId(null)
                  setisUnAvail(true); 
                  setisAvail(false); 
              }
            })
               return () => {
                    unsubscribeOnlineUsers();
                    unsubscribeOfflineUsers();
                }

})
    
  }, [users, onlineId])

  useEffect(()=>{  
      trackActivity()
  }, [users, onlineId])

  const filteredUsers = others && others.filter(user =>
    filter === 'all' ? true : user.gender === filter
  );

  

  const handleFilterChange = (gender) => {
    setFilter(gender);
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-gray-700 dark:text-gray-300">Connect with Users</h1>
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <button onClick={() => handleFilterChange('all')} className={`px-4 py-1 ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} rounded-md`}>All</button>
          <button onClick={() => handleFilterChange('male')} className={`px-4 py-1 ${filter === 'male' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} rounded-md`}>Male</button>
          <button onClick={() => handleFilterChange('female')} className={`px-4 py-1 ${filter === 'female' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'} rounded-md`}>Female</button>
        </div>
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {console.log(others)}
        {filteredUsers.map(user => ( 
          
          <div key={user.userId} className="bg-white dark:bg-gray-700 p-4 rounded-md shadow-md flex items-center w-full">
            <img
              src={user.picture||URL.createObjectURL(user.picture) }
              alt={user.name}
              className="rounded-full w-[50px] h-[50px]"
              width={50}
              height={50}
            />
            <div className="ml-4 w-full pr-10">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">{user.name}</h2>
              {/* <p className="text-gray-600 dark:text-gray-400 w-full">{user.email}</p> */}
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.nickname}</p>
              <div className="flex items-center gap-2">
                
                {(onlineId && ((user.userId==onlineId))) && 
                <FaCircle className={`w-3 h-3 ${(onlineId && ((user.userId == onlineId))) ? 'text-green-500' : 'text-gray-400'}`} />} 
                {/* isAvail==true && (user.isOnline==true) &&  */}
                
                {(onlineId && ((user.userId==onlineId)))  && 
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(onlineId && ((user.userId==onlineId)))? 'Available' : 'Offline'}
                </p>}
                {/* <p className="text-sm text-gray-500 dark:text-gray-400">{user.nickname}</p> */}
                {/* {(offlineId && (user.userId==offlineId))   && <p className="text-sm text-gray-500 dark:text-gray-400">{(offlineId && (user.userId==offlineId))? 'Offline' : 'Online'}</p>} */}
                {/* {(offlineId && (user.userId==offlineId)) && <p className="text-sm text-gray-500 dark:text-gray-400">{(offlineId && (user.userId==offlineId)) && 'Unavailable'}</p>} */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(Connects);

  