// pages/dashboard.js
'use client'

// pages/dashboard.js
import { useEffect, useState, useCallback, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { collection, onSnapshot } from  'firebase/firestore'
import LoadingDots from './LoadingDots';
import useAuth from '@/custom_hooks/useAuth';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import Profile from './Profile';
import Connects from './Connects';
import GroupChats from './GroupChats';
import Link from 'next/link';
import ChatHeader from './ChatHeader';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  const [isPendingOut, startTransitionOut] = useTransition()
  const [isSignedOut, setIsSignedOut] = useState(false)  
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [showContent, setShowContent] = useState(false);

  const { activeuser, loading } = useAuth();

  var timerId_login, timerId_proj;

//   const handleSignOut = () => {
//     startTransitionOut(async() => {
//       try{
//         setIsSignedOut(true)
//         // clearTimeout(timerId_proj && timerId_proj)
//         // clearTimeout(timerId_login && timerId_login)
//         await signOut(auth);
//         // router.push('/login')
//       }
//       catch(err){
//         console.error(err.message, "Unable to sign out")
//       }
//     })
//   };

  useEffect(() => {
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user && !loading && !activeuser) {
        setIsSignedOut(true)
        timerId_login = setTimeout(()=>window.location.href='/login', 1000);
      }else if (user) {
        setShowContent(true);
        timerId_proj = setTimeout(()=>router.push('/proj/1'), 5000)
      }
    });

    const usersCollection = collection(db, 'users');
    const unsubscribeUsers = onSnapshot(usersCollection, (snapshot) => {
      const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUsers();
      clearTimeout(timerId_login)
      clearTimeout(timerId_proj)
    };
  }, [activeuser, loading, router]);

  useEffect(() => {
    if (selectedUser) {
      const messagesCollection = collection(db, 'chats', selectedUser.id, 'messages');
      const q = query(messagesCollection, orderBy('timestamp'));
      const unsubscribeMessages = onSnapshot(q, (snapshot) => {
        const messagesData = snapshot.docs.map((doc) => doc.data());
        setMessages(messagesData);
      });

      return () => unsubscribeMessages();
    }
  }, [selectedUser]);

  const handleSendMessage = useCallback(async(message) => {
    if (selectedUser) {
      const messagesCollection = collection(db, 'chats', selectedUser.id, 'messages');
      await addDoc(messagesCollection, {
        text: message,
        timestamp: new Date(),
        isSent: true,
      });
    }
  }, [selectedUser]) 

  if (loading) return <LoadingDots/>;

//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//       if (!user) {
//         router.push('/login');
//       }
//     });

//     return () => {
//       unsubscribeAuth();
//     };
//   }, [router]);

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return <Profile />;
      case 'connects':
        return <Connects />;
      case 'group':
        return <GroupChats />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className={`${isSignedOut && 'isSignedOut'}  flex h-screen`}>
    {showContent && 
      <div className='w-full slideIn flex xsm:max-lg:flex-col'>
      <Sidebar timerId_login={timerId_login} timerId_proj={timerId_proj} users={users} onSelectUser={setSelectedUser} onSelectTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader/>
      <div className="flex-1 p-4  ">{renderContent()}</div>
         <ChatWindow messages={messages} />
         {(activeTab !== 'profile') && <ChatInput onSendMessage={handleSendMessage} />}
      </div>
      </div>
    }
    </div>
  );
};

export default Dashboard;


//////////////////////////////////////////////////////

// // import styles from '../../styles_css/Dashboard.css'
// import styles from '../globals.css'
// import useAuth from '@/custom_hooks/useAuth';
// import { useEffect, useState, useCallback } from 'react';
// import { useRouter } from 'next/navigation';
// import Sidebar from '../components/Sidebar';
// import ChatWindow from '../components/ChatWindow';
// import ChatInput from '../components/ChatInput';
// import { onAuthStateChanged, getAuth } from 'firebase/auth';
// import { collection, query, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
// import { auth, app, db } from '../firebase/config'
// import LoadingDots from './LoadingDots';

// const Dashboard = () => {
// //   const auth = getAuth(app)
//   const [users, setUsers] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const router = useRouter();
//   const [showContent, setShowContent] = useState(false);

//   const { activeuser, loading } = useAuth();

//   useEffect(() => {
//     const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
//       if (!user && !loading && !activeuser) {
//         router.push('/login');
//       }else if (user) {
//         setShowContent(true);
//       }
//     });

//     const usersCollection = collection(db, 'users');
//     const unsubscribeUsers = onSnapshot(usersCollection, (snapshot) => {
//       const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setUsers(usersData);
//     });

//     return () => {
//       unsubscribeAuth();
//       unsubscribeUsers();
//     };
//   }, [activeuser, loading, router]);

//   useEffect(() => {
//     if (selectedUser) {
//       const messagesCollection = collection(db, 'chats', selectedUser.id, 'messages');
//       const q = query(messagesCollection, orderBy('timestamp'));
//       const unsubscribeMessages = onSnapshot(q, (snapshot) => {
//         const messagesData = snapshot.docs.map((doc) => doc.data());
//         setMessages(messagesData);
//       });

//       return () => unsubscribeMessages();
//     }
//   }, [selectedUser]);

//   const handleSendMessage = useCallback(async(message) => {
//     if (selectedUser) {
//       const messagesCollection = collection(db, 'chats', selectedUser.id, 'messages');
//       await addDoc(messagesCollection, {
//         text: message,
//         timestamp: new Date(),
//         isSent: true,
//       });
//     }
//   }, [selectedUser]) 

//   if (loading) return <LoadingDots/>;

//   return (
//     <div className={`${styles.container} flex h-screen`}>
 
//       {/* { */}
//       {showContent && 
//       <div className='slideIn w-full flex'>
//       <Sidebar users={users} onSelectUser={setSelectedUser} />
//       <div className="flex-1 flex flex-col">
//         <ChatWindow messages={messages} />
//         <ChatInput onSendMessage={handleSendMessage} />
//       </div>
        
//       </div>
//       }
      
//     </div>
//   );
// };

//export default Dashboard;
