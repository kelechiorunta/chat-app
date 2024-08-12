'use client'

import { createContext, useEffect, useState } from "react";
import React from 'react'
import useAuth from "@/custom_hooks/useAuth";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged} from 'firebase/auth';
import { doc, onSnapshot, getDoc, collection } from "firebase/firestore";

export const authContext = createContext(null)



export default function AuthComponent({children}) {
    const [isSignedOut, setIsSignedOut] = useState(false) 
    const { activeuser } = useAuth()
    const [isFetched, setIsFetched] = useState(false)
    const [active, setActive] = useState(null)
    const [photo, setPhoto] = useState(null)
    const [connects, setConnects] = useState([])
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
                        setPhoto(picture)
                    })

                    const usersCollection = collection(db, 'users');
                    const unsubscribeUsers = onSnapshot(usersCollection, (snapshot) => {
                    const usersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                    setConnects(usersData);
                    });

                    return () => {
                        unsubscribeUsers();
                        unsub()
                    }
    
                    // return () => {
                    //     unsub()
                    // }
                   }
                    
                }
            })
        }
        
    }, [active, activeuser, auth, photo, connects])

  return (
    <authContext.Provider value={{active, isSignedOut, setIsSignedOut, photo, activeuser, isFetched, setIsFetched}}>
        {children}
    </authContext.Provider>
  )
}

