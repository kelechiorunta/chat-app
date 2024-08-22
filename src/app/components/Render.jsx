import React, { useEffect } from 'react'
import { useState } from 'react'
import useUsers from '../firebase/hook/useUsers';

export default function Render({children}) {
    const { users } = useUsers()
    const users_data = users && users.map(user=>(user.userdata))
    
    const [count, setCount] = useState(0);
    const increment = () => {
        setCount(prev=>prev+1)
    }
  return (
    <div className='p-4 w-full rounded-md 
    bg-gradient-conic from-slate-200 via-blue-600 to-slate-200'>
        {console.log(users_data)}
        {children(count, increment, users_data)}
    </div>
  )
}
