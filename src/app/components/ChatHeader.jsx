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
// import useUsers from '../firebase/hook/useUsers'

export default function ChatHeader({others, setOthers}) {
  // const { activeuser } = useAuth()
  const { photo, users, onlineUsers  } = useContext(authContext)
  // const { photo } = signedUserContext
  const [photoPic, setPhoto] = useState(null)
  // const { users } = useUsers()
  
  const handleSearch = (e) => {
    const searchedUser = onlineUsers && onlineUsers.filter(user=>{
      return user.name.toLowerCase().includes(e.target.value.toLowerCase()) 
    })
    if (searchedUser && (e.target.value.length>0))
      setOthers(searchedUser)
    else{
      setOthers(onlineUsers && onlineUsers) 
    }
    
  }

  return (
    <header className='bg-slate-700 text-black w-full px-4 py-2 sticky top-0 z-20'>
        <nav className='flex items-end justify-between xsm:max-[400px]:max-w-[300px]'>
            <Link className='text-white xsm:max-[400px]:hidden' href={'/animation'}>HOME</Link>
            <div className='flex gap-x-2 items-center' >
                <input className='p-2 rounded'
                       type='search' 
                       onChange={handleSearch}
                        name='search'
                        placeholder='Search'/>
                <button className='flex items-center justify-center xsm:max-[400px]:hidden'><FaSearch fill='white' size={20} /></button>
            </div>
            {console.log(others)}
            <button className='bg-slate-400 text-white rounded-md border-white shadow-md px-4 py-2 xsm:max-[400px]:hidden'
            onClick={async()=>{await signOut(auth)}}>
              Logout
            </button>
            <Link className='w-[50px] rounded-full xsm:max-[400px]:hidden' href={'/dashboard'}>
                <img src={photo && photo} alt='pic' 
                       className='w-[50px] h-[50px] rounded-full shadow-md'/>
            </Link>
        </nav>
    </header>
  )
}
