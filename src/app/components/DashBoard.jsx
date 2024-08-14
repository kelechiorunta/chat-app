// pages/dashboard.js
'use client'

// pages/dashboard.js
import { useEffect, useState, useCallback, useTransition, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { collection, onSnapshot, doc, query, addDoc, orderBy } from  'firebase/firestore'
import LoadingDots from './LoadingDots';
import useAuth from '@/custom_hooks/useAuth';
import ChatWindow from './ChatWindow';
import ChatInput from './ChatInput';
import Profile from './Profile';
import Connects from './Connects';
import GroupChats from './GroupChats';
import Link from 'next/link';
import ChatHeader from './ChatHeader';
import { authContext } from './AuthComponent';
import useUsers from '../firebase/hook/useUsers';


const Dashboard = () => {
  const [istyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  const [isPendingOut, startTransitionOut] = useTransition()
  const [isSignedOut, setIsSignedOut] = useState(false) 
  // const {isSignedOut, setIsSignedOut} = useContext(authContext)
  const [clients, setClients] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [others, setOthers] = useState([])
  const [showContent, setShowContent] = useState(false);
  const [isAvail, setisAvail] = useState(false)
  const [animate_user, setAnimateUser] = useState(false)

  const { activeuser, loading } = useAuth();

  const { users } = useUsers();

  var timerId_login, timerId_proj;

  const trackTyping = () => {
    setIsTyping(!istyping)
  }

  const fetchUsers = () => {
    if (users && users.length>0){
      setOthers(users && users.map((user, index)=>(user.userdata)))
    }   
  }

  useEffect(()=>{
    fetchUsers()
  }, [users])

  useEffect(() => {
    
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user && !loading && !activeuser) {
        setIsSignedOut(true)
        window.location.href='/login'
        // router.push('/login')
        //  timerId_login = setTimeout(()=>window.location.href='/login', 1000);
      }else if (user) {
        console.dir(activeuser)
        setShowContent(true);
        // timerId_proj = setTimeout(()=>router.push('/proj'), 5000)
      }
    });

    const usersCollection = collection(db, 'users');
    const unsubscribeUsers = onSnapshot(usersCollection, (snapshot) => {
    const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setClients(usersData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeUsers();
      // clearTimeout(timerId_login)
      clearTimeout(timerId_proj)
    };
  }, [activeuser, loading, router]);

  useEffect(() => {
    if (selectedUser) {
      alert("There is a selected user")
      // [user.uid, recipient.id].sort().join('_');
      const mergedIds = [`${activeuser && activeuser.uid}`, `${selectedUser.userId}`].sort().join('_');
      console.log(mergedIds)
    
      const messagesCollection = collection(db, 'chats', mergedIds, 'messages');
      const q = query(messagesCollection, orderBy('timestamp'));
      const unsubscribeMessages = onSnapshot(q, async(snapshot) => {
        if (snapshot){
          const messagesData = snapshot.docs.map((doc) => doc.data());
          setMessages(messagesData);
        }else{
          await addDoc(messagesCollection, {
            text: 'Hello',
            timestamp: new Date(),
            isSent: true,
          });
        }
        
      });

      return () => unsubscribeMessages();
    }

    ///////////////////////////////////////////////////


//     const trackUserActivity = async() => {
//       try{
//         const usersCollection = doc(db, 'users', activeuser.uid);
//         const snapshot = await getDoc(usersCollection)
        
//         // const usersData = (snapshot && snapshot.docs) && snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        
//         if (snapshot.exists()){
//           const unsubscribeUsers = onSnapshot(usersCollection, (snapshot) => {
//           const { isOnline } = snapshot.data().userdata
//           if (isOnline){
//             // setConnects(usersData);
//             setisAvail(true);
//             alert("User is online")
//           }else{
//             alert("User is offline")

//           }
//         })
      
  
//         return () => {
//             unsubscribeUsers();
//             // unsub()
//         }
//       }
//       }
//       catch(err){
//         console.error(err.message, 'Failed to track Users')
//       }
//     }
    
//  trackUserActivity()

 ///////////////////////////////////////////////////////////

  }, [selectedUser]);

  const handleSendMessage = useCallback(async(message) => {
    const mergedIds = [`${activeuser && activeuser.uid}`, `${selectedUser.userId}`].sort().join('_');
    if (selectedUser) {
      const messagesCollection = collection(db, 'chats', mergedIds, 'messages');
      await addDoc(messagesCollection, {
        senderId: activeuser.uid,
        recipientId: selectedUser.userId,
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

  const renderContent = ({activeuser}) => {
    switch (activeTab) {
      case 'profile':
        return <Profile signedInUser={activeuser} activetab={activeTab} />;
      case 'connects':
        return <Connects animate_user={animate_user} setSelectedUser={setSelectedUser} others={others && others} setOthers={setOthers} />;
      case 'group':
        return <GroupChats />;
      default:
        return <Profile signedInUser={activeuser} activetab={activeTab}/>;
    }
  };

  return (
    <div className={`${isSignedOut && 'isSignedOut'}  flex h-screen`}>
    {showContent && 
      <div className='w-full slideIn flex xsm:max-lg:flex-col'>
      <Sidebar animate_user={animate_user} setAnimateUser={setAnimateUser} timerId_login={timerId_login} timerId_proj={timerId_proj} users={clients} onSelectUser={setSelectedUser} onSelectTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col">
        <ChatHeader others={others} setOthers={setOthers}/>
      <div className="flex-1 p-4 ">{renderContent({activeuser})}</div>
         <ChatWindow istyping={istyping} setIsTyping={setIsTyping} signedUser={activeuser} selectedUser={selectedUser} messages={messages} />
         {(activeTab !== 'profile') && <ChatInput istyping={istyping} setIsTyping={setIsTyping} onSendMessage={handleSendMessage} />}
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
//   const [users, setClients] = useState([]);
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
//       setClients(usersData);
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
