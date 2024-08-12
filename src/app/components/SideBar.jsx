// components/Sidebar.js
'use client'
import { useState, useTransition, memo, useContext } from 'react';
import { FaUserEdit, FaUsers, FaUserFriends, FaSignOutAlt, FaSpaceShuttle, FaSpinner } from 'react-icons/fa';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { useRouter } from 'next/navigation';
import { onSnapshot, getDoc, setDoc, updateDoc, doc } from 'firebase/firestore';
import Link from 'next/link';
import { authContext } from './AuthComponent';


const Sidebar = ({timerId_proj, timerId_login, onSelectTab,}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [isPending, startTransition] = useTransition()
  const signoutContext = useContext(authContext)

  const {isSignedOut, setIsSignedOut} = signoutContext

  const handleSignOut = async() => {
    startTransition(async() => {
      //  if (auth) {
        try{
          onAuthStateChanged(auth, async(user) => {
            if (user){
              const userRef = doc(db, 'users', user && user.uid)
              const snapshot = await getDoc(userRef)
              
                // const unsub = onSnapshot(userRef, async(snapshot) => {
                  if (snapshot.exists()){
                    const { isOnline } = snapshot.data().userdata
                    
                    if (isOnline){
                      await setDoc(userRef, {userdata:{isOnline:false}}, {merge:true})
                      alert(`${user.displayName||user.email} is no longer active`)
                      
                      await signOut(auth);
                      // router.push('/login')
              
                      }
                  }
                // })
    
                // return () => unsub();
            }
            
              
          })
          
        }
        catch(err){
          console.error(err.message, "Unable to sign out")
        }
       
    })
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onSelectTab(tab);
  };

  return (
    <div className="w-1/4 h-full bg-gray-800 text-white p-4
     flex flex-col justify-between xsm:max-lg:w-full">
      <div className='w-full xsm:max-lg:w-full'>
        <h2 className="text-2xl mb-4">Dashboard</h2>
        <ul className='w-full'>
          <li
            className={`cursor-pointer p-2 flex items-center ${activeTab === 'profile' && 'bg-gray-700'}`}
            onClick={() => handleTabClick('profile')}
          >
            <FaUserEdit className="inline-block mr-2" />
            Update Profile
          </li>
          <li
            className={`cursor-pointer p-2 flex items-center ${activeTab === 'connects' && 'bg-gray-700'}`}
            onClick={() => handleTabClick('connects')}
          >
            <FaUserFriends className="inline-block mr-2" />
            Connects/Other Users
          </li>
          <li
            className={`cursor-pointer p-2 flex items-center ${activeTab === 'group' && 'bg-gray-700'}`}
            onClick={() => handleTabClick('group')}
          >
            <FaUsers fill='white' className="inline-block mr-2" />
            Create Group Chats
          </li>
          <li
            className={`cursor-pointer p-2 flex items-center`} //${activeTab === 'profile' && 'bg-gray-700'}`}
            // onClick={() => handleTabClick('profile')}
          >
            <FaSpaceShuttle className="inline-block mr-2" />
            {/* Proj */}
            <Link className='text-white' href={`/proj`}>About Developer</Link>
          </li>
         
        </ul>
      </div>
      <button
        className="mt-4 p-2 w-full bg-red-600 hover:bg-red-500 flex items-center justify-center"
        onClick={handleSignOut}
      >
        <FaSignOutAlt fill='white' className="inline-block mr-2" />
        {/* Logout */}
        {isPending? <FaSpinner fill='white' size={20} className='animate-spin mx-auto'/> : 'Sign Out'}
      </button>
    </div>
  );
};

export default memo(Sidebar);