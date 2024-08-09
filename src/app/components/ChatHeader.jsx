import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaSearch } from 'react-icons/fa'

export default function ChatHeader() {
  return (
    <header className='bg-slate-700 text-white w-full p-4 sticky top-0'>
        <nav className='flex items-end justify-between xsm:max-[400px]:hidden'>
            <Link href={'/dashboard'}>HOME</Link>
            <div className='flex gap-x-2 items-center' >
                <input className='p-2 rounded ' type='search' name='search' placeholder='Search'/>
                <button className='flex items-center justify-center'><FaSearch fill='white' size={20} /></button>
            </div>
            <Link href={'/dashboard'}>
                <Image src={''} alt='pic' 
                       className='max-w-[50px] max-h-[50px] rounded-full shadow-md'/>
            </Link>
        </nav>
    </header>
  )
}
