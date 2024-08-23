import React, { useCallback, useEffect } from 'react'
import { useState } from 'react'
import useUsers from '../firebase/hook/useUsers';
import { collection, doc, getDoc, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

export default function Render({children}) {
    const { users } = useUsers()
    const [online, setOnline] = useState(false)
    const [id, setId] = useState(null)
    const [trackeddata, setTrackedData] = useState(null)

    const trackUsers = useCallback(async()=>{
        const mappedUsers = users && users.map(user=>(user.userdata))
        users && users.forEach(async(user)=>{
            const userRef = doc(db, 'users', user && user.userId)
            // const userRef = query(userCollection)
             const userRefsnapshot = await getDoc(userRef)
            if (userRefsnapshot.exists()){
                const onlineUsers = []
                const unsub = onSnapshot(userRef, async(snapshot) => {
                    if (snapshot.exists()){
                        console.log(snapshot)
                        const {isOnline, userId} = snapshot.data()
                        alert('I seee you')
                        if (isOnline==true){
                            setOnline(true)
                            setId(userId) 
                            console.log(id)  
                        }
                        
                    }
                    setTrackedData(mappedUsers)
                    
                })
                return () => unsub()
             }
           
            console.log(userRef)
        })
        
        
    },[trackeddata, id, online])

    const users_data = users && users.map(user=>(user.userdata))

    useEffect(() => {
        trackUsers();
    }, [ id, online])
    
    
    const [count, setCount] = useState(0);
    const increment = () => {
        setCount(prev=>prev+1)
    }
  return (
    <div className='p-4 w-full rounded-md 
    bg-gradient-conic from-slate-200 via-blue-600 to-slate-200'>
        {console.log(users_data)}
        {children(count, increment, users_data, online, id)}
    </div>
  )
}
