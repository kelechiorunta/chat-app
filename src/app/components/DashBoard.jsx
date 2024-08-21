// pages/dashboard.js
'use client'

// pages/dashboard.js
import { useEffect, useState, useCallback, useTransition, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { collection, onSnapshot, doc, query, addDoc, orderBy, updateDoc, setDoc } from  'firebase/firestore'
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
import Validateuser from './Validateuser';


const Dashboard = () => {
  const [istyping, setIsTyping] = useState(false)
  const [activeTab, setActiveTab] = useState('profile');
  const router = useRouter();
  const [isPendingOut, startTransitionOut] = useTransition()
  const [isSignedOut, setIsSignedOut] = useState(false) 
  const {sender, formerUsers, selectedUser, setSelectedUser, session, setSession, setSender, prev, messages, setMessages} = useContext(authContext)
  const [clients, setClients] = useState([]);
  const [isPending, startTransition] = useTransition();
  // const [selectedUser, setSelectedUser] = useState(null);
  // const [messages, setMessages] = useState([]);
  const [others, setOthers] = useState([])
  const [showContent, setShowContent] = useState(false);
  const [isAvail, setisAvail] = useState(false)
  const [animate_user, setAnimateUser] = useState(false)
  const [notify, setNotify] = useState('')
  const [showValidateUser, setShowValidateUser] = useState(false);

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

  const revalidateChats = useCallback(() => {
    if (formerUsers == selectedUser){
      setShowValidateUser(false)
      setSelectedUser(formerUsers)
    }else 
    {setShowValidateUser(true)
      setSelectedUser(selectedUser)
    }
    if (selectedUser && formerUsers) {
     
       //alert(`Ready to connect with ${selectedUser && selectedUser.nickname}`)
      // [user.uid, recipient.id].sort().join('_');
      const mergedIds = [`${activeuser && activeuser.uid}`, `${selectedUser  && selectedUser.userId}`].sort().join('_');
      console.log(mergedIds)
      setSession(mergedIds)
    
      const messagesCollection = collection(db, 'chats', mergedIds, 'messages');
      const q = query(messagesCollection, orderBy('timestamp'));
      const unsubscribeMessages = onSnapshot(q, async(snapshot) => {
        if (snapshot){
          // const messagesData = snapshot.docs.map((doc) => doc.data());
          const messagesData = snapshot.docs.map((doc) => {
            const messageData = doc.data();
      
            if (!messageData.isRead) {
              // Update only the isRead property and merge with existing data
              updateDoc(doc.ref, { isRead: true }, { merge: true });
              // setNotify('No new messages')
            }
            return messageData;
          });
          
          setMessages(messagesData);
        }else{
          await addDoc(messagesCollection, {
            text: 'Hello',
            timestamp: new Date(),
            isSent: true,
            istyping:istyping,
          });
        }
        
      });

      return () => unsubscribeMessages();
    }
  }, [selectedUser, formerUsers, showValidateUser])

  useEffect(() => {

    revalidateChats()

  }, [selectedUser, prev, formerUsers, showValidateUser]);

  const handleSendMessage = async(message) => {
    // const mergedIds = [`${activeuser && activeuser.uid}`, `${selectedUser && selectedUser.userId}`].sort().join('_');
    if (selectedUser ) {
      const mergedIds = [`${activeuser && activeuser.uid}`, `${selectedUser && selectedUser.userId}`].sort().join('_');
      const messagesCollection = collection(db, 'chats', mergedIds, 'messages');
      // setSender(activeuser && activeuser.uid)
      await addDoc(messagesCollection, {
        senderId: activeuser.uid,
        recipientId: selectedUser.userId,
        text: message,
        timestamp: new Date(),
        isSent: true,
        isRead: false
      });
    }
  }

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
        return <Connects selectedUser={selectedUser} notify={notify} setNotify={setNotify} animate_user={animate_user} setSelectedUser={setSelectedUser} others={others && others} setOthers={setOthers} />;
      case 'group':
        return <GroupChats />;
      default:
        return <Profile signedInUser={activeuser} activetab={activeTab}/>;
    }
  };

  return (
    <div className={`${isSignedOut && 'isSignedOut'}  flex w-full xsm:max-lg:flex-col`}>
    {showContent && 
      <div className='w-full  flex xsm:max-lg:flex-col bg-gradient-to-t from-blue-400 via-black to-blue-500'>
      <Sidebar animate_user={animate_user} setAnimateUser={setAnimateUser} timerId_login={timerId_login} timerId_proj={timerId_proj} users={clients} onSelectUser={setSelectedUser} onSelectTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col xsm:max-lg:w-full">
        <ChatHeader others={others} setOthers={setOthers}/>
      
      <div className="flex-1 flex p-4 w-full xsm:max-md:flex-col ">
        {renderContent({activeuser})}
      <div className='flex w-full '>
         { (showValidateUser) ? <Validateuser setShowValidateUser={setShowValidateUser}
      incomingUser={selectedUser}/> : (activeTab !== 'profile') && <ChatWindow istyping={istyping} setIsTyping={setIsTyping} signedUser={activeuser} setSelectedUser={setSelectedUser} selectedUser={selectedUser} messages={messages} />}
         </div>
        </div>
         {(activeTab !== 'profile') && <ChatInput istyping={istyping} trackTyping={trackTyping} onSendMessage={handleSendMessage} />}
       
      </div>
      </div>
    }
    </div>
  );
};

export default Dashboard;



