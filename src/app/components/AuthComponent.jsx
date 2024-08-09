'use client'

import { createContext, useEffect, useState } from "react";
import React from 'react'
import useAuth from "@/custom_hooks/useAuth";
import { auth } from "../firebase/config";
import { onAuthStateChanged} from 'firebase/auth';

export const authContext = createContext()



export default function AuthComponent({children}) {
    const { activeuser } = useAuth()
    const [active, setActive] = useState(null)
    useEffect(()=>{
        onAuthStateChanged(auth, (user) => {
            if (user || activeuser){
                setActive(user.currentUser)
            }
        })
    }, [active, activeuser])

  return (
    <authContext.Provider value={{active, activeuser}}>
        {children}
    </authContext.Provider>
  )
}

