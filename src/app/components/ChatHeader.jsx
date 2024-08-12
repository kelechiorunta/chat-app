'use client'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState, useContext } from 'react'
import { authContext } from './AuthComponent'
import { FaSearch } from 'react-icons/fa'
import useAuth from '@/custom_hooks/useAuth'
import { auth, db } from '../firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'

export default function ChatHeader() {
  // const { activeuser } = useAuth()
  const signedUserContext = useContext(authContext)
  const {active, photo} = signedUserContext
  const [photoPic, setPhoto] = useState(null)
  
  // useEffect(()=>{
  //   const getActiveUser = async() => {
  //     try{
  //       const userRef = doc(db, 'users', active.uid)
  //       const userSnapshot = await getDoc(userRef)
  //       if (userSnapshot.exists()){
  //         const data = userSnapshot.data()
  //         const { userdata } = data
  //         const { picture } = userdata
  //         setPhoto(picture)
  //       }
  //     }
  //     catch(err){
  //       console.error('Unable to load user picture')
  //     }
  //   }
  //   getActiveUser()
  // }, [active, photo])
  return (
    <header className='bg-slate-700 text-white w-full p-4 sticky top-0'>
        <nav className='flex items-end justify-between xsm:max-[400px]:hidden'>
            <Link href={'/dashboard'}>HOME</Link>
            <div className='flex gap-x-2 items-center' >
                <input className='p-2 rounded ' type='search' name='search' placeholder='Search'/>
                <button className='flex items-center justify-center'><FaSearch fill='white' size={20} /></button>
            </div>
            <button className='bg-slate-400 text-white rounded-md border-white shadow-md px-4 py-2'
            onClick={async()=>{await signOut(auth)}}>
              Logout
            </button>
            <Link className='w-[50px] rounded-full' href={'/dashboard'}>
                <img src={photo && photo} alt='pic' 
                       className='max-w-[50px] max-h-[50px] rounded-full shadow-md'/>
            </Link>
        </nav>
    </header>
  )
}
