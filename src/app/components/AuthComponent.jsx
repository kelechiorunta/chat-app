'use client'

import { createContext, useCallback, useEffect, useState } from "react";
import React from 'react'
import useAuth from "@/custom_hooks/useAuth";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged} from 'firebase/auth';
import { doc, onSnapshot, getDoc, collection, query, orderBy, where } from "firebase/firestore";
// import useUsers from "../firebase/hook/useUsers";

export const authContext = createContext(null)

export default function AuthComponent({children}) {
    
    const [isSignedOut, setIsSignedOut] = useState(false) 
    const { activeuser } = useAuth()
    const [isFetched, setIsFetched] = useState(false)
    const [active, setActive] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [connects, setConnects] = useState([])
    const [users, setUsers] = useState([])
    const [onlineUsers, setOnlineUsers] = useState([])
    const [sender, setSender] = useState(null)
    const [session, setSession] = useState(null)
    const [prev, setPrev] = useState(null)
    const [messages, setMessages] = useState([]);
    const [unreadMsg, setUnreadMsg] = useState(0)
    const [ignoredUserId, setIgnoredUserId] = useState(null)
    const [selectedUser, setSelectedUser] = useState(null);
    const [istyping, setIsTyping] = useState(false)
    const [formerUsers, setFormerUsers] = useState(null)
    
    

    useEffect(()=>{
        if (auth && db) {

            

            onAuthStateChanged(auth, async(user) => {
                if (user || activeuser){
                    setActive(user)
    
                   if (user && auth){
                    const userRef = doc( db, 'users', user && user.uid)
                    const snapshot = await getDoc(userRef)
                    
                    const unsub = onSnapshot(userRef, (snapshot) => {
                        const data = snapshot.data()
                        const { picture } = data.userdata 
                        if (picture){
                          setPhoto(picture)
                        }
                        
                    })

                    const usersCollection = collection(db, 'users');
                    const unsubscribeUsers = onSnapshot(usersCollection, (snapshot) => {
                    const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setConnects(usersData);
                    });

                    // const auth = getAuth(app);
                    const currentUser = user//auth && auth.currentUser;
                    // const usersRef = collection(db, 'users');
                    const q = query(usersCollection, where('userdata.userId', '!=', (currentUser && currentUser.uid)), orderBy('userdata.name'));
                
                    const unsubscribe = onSnapshot(q, async(snapshot) => {
                      // const fetchedUsers = await getDocs(q)
                      const fetchedUsers = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                      }));
                      // const connects = []
                      // fetchedUsers.forEach(docs=>{
                      //   connects.push(docs.map(doc=>({id: doc.id, ...doc.data()})))
                      // })
                      setUsers(fetchedUsers);
                    });
                
                    
                //   }, [auth]);
                
                //   return { users };
                // };
                

                    

                    return () => {
                        unsubscribeUsers();
                        unsub();
                        unsubscribe();
                    }
    
                    // return () => {
                    //     unsub()
                    // }
                   }
                    
                }
            })
        }
        
    }, [active, activeuser, auth, photo,])

  return (
    <authContext.Provider value={{formerUsers, setFormerUsers, istyping, setIsTyping, selectedUser, setSelectedUser, ignoredUserId, setIgnoredUserId, unreadMsg, setUnreadMsg, messages, setMessages, prev, setPrev, active, users, session, setSession, sender, setSender, onlineUsers, setOnlineUsers, isSignedOut, setIsSignedOut, photo, activeuser, isFetched, setIsFetched}}>
        {children}
    </authContext.Provider>
  )
}

