import { FaCircle } from "react-icons/fa";
import BallObject from "./BallObject";
import Render from "./Render";
import useUsers from "../firebase/hook/useUsers";
import { doc, getDoc, collection, updateDoc, query, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useState, useEffect, useCallback, useContext } from "react";
import { authContext } from "./AuthComponent";


// components/GroupChats.js
const GroupChats = () => {
  const { active } = useContext(authContext)
  const { users } = useUsers()
    const [online, setOnline] = useState(false)
    const [id, setId] = useState(null)
    const [trackeddata, setTrackedData] = useState(null)

    const trackUsers = useCallback(async()=>{
        const mappedUsers = users && users.map(user=>(user.userdata))
        
        console.log(mappedUsers && mappedUsers)
        mappedUsers && mappedUsers.forEach(async(user)=>{
            // const userRef = doc(db, 'users', user && user.userId)
            // const userRef = query(userCollection)
            
            const userCollection = collection(db, 'users')
            const userRef = query(userCollection)
            //  const userRefsnapshot = await getDoc(userRef)
             
            // if (userRefsnapshot.exists()){
              
                
                const unsub = onSnapshot(userRef, async(snapshot) => {
                  const onlineUsers = []
           
                  if (snapshot){
                      // const onlineUsers = []
                      
                      snapshot.forEach(doc=>{
                        const userData = doc.data().userdata;
                       
                        
                            if (userData && userData.userId !== (active && active.uid)) {
                              onlineUsers.push(userData);
                              
                              setId(userData.userId);
                              setOnline(userData.isOnline);
                              // updateDoc(doc.ref, { "userdata.isOnline": true }, { merge: true });
                              
                            } 
                            
                          });

                          const trackedOnlineUsers = onlineUsers.filter(user =>{return (user.userId != active && active.uid)})
                            setTrackedData(trackedOnlineUsers)
                            
                          
                          
                    }
                    
                    
                })
                return () => unsub()
                
            // }
           
            console.log(userRef)
        })
        
        
    },[users, trackeddata, id, online])

    const users_data = users && users.map(user=>(user.userdata))

    useEffect(() => {
        trackUsers();
    }, [users, id, online])

    return (
      <div className="w-full min-h-[540px]">
        {/* <h2 className="text-2xl mb-4">Create Group Chats</h2> */}
        <Render>
        {(count, increment) => (
          <div className="flex divide-y-2 gap-2 w-full h-full items-center">
          
            <ul className="w-full ">
              {console.log(users_data)}
                {trackeddata && trackeddata.map((user, index) => {
                  return (
                    <div 
                    key={user.userId}
                    className="w-[100%] gap-2 flex border rounded-md shadow-md px-2 py-4 bg-gradient-to-b from-slate-500 via-slate-200 to-slate-500">
                      <img className='flex items-center justify-center rounded-full shadow-md w-[50px] h-[50px] bg-black text-white'
                      src={user.picture} 
                      alt={user.nickname[0]}/>
                      
                      
                      <div className="flex justify-between items-center space-x-2 w-full">
                        <div className="flex flex-col w-full">
                          <p className="uppercase">{user.nickname}</p>
                          {console.log(trackeddata && trackeddata)}
                          <p className="flex items-center gap-x-2 italic text-[15px]"><FaCircle className={`w-3 h-3 ${((user.isOnline==true) ) ? 'text-green-500' : 'text-gray-400'}`} />{user.isOnline? 'Online' : 'Offline'}</p>
                          <p className="text-sm text-gray-900 dark:text-gray-400 xsm:max-sm:float-none xsm:max-sm:ml-0">{user && user.time? user?.time.toDate().toLocaleTimeString() : ''}</p>
                        </div>
                        
                        <div className="flex items-center gap-x-2 w-full ">
                          <button className="w-full p-2 text-white bg-gradient-to-t rounded-md shadow-xl from-blue-600 via-blue-400 to-blue-600">Join</button>
                          {/* <button className="w-full">Disconnected</button> */}
                        </div>
                      </div>
                      {/* <p></p> */}
                    </div>
                  )
                })}
            </ul>
          </div>
        )}
      </Render>
        
        {/* Add your group chats creation form or content here */}
      </div>
    );
  };
  
  export default GroupChats;
  