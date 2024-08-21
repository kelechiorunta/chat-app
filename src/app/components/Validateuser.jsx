import React, { useContext, useState } from 'react'
import { authContext } from './AuthComponent'
import Modal from './Modal'


export default function Validateuser({incomingUser, setShowValidateUser}) {
    const { selectedUser, setSelectedUser, formerUsers, setFormerUsers } = useContext(authContext)
    const [isModalOpen, setIsModalOpen] = useState(true);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => {setIsModalOpen(false); setShowValidateUser(false);   }
  return (
    // <div className='inset-0 absolute z-20'>
        <Modal
        title={'CONNECT'}
        isOpen={isModalOpen} 
        onClose={()=>{ setSelectedUser(formerUsers) ; setShowValidateUser(false);  closeModal();  }}>
        <div className='p-4 rounded-md flex flex-col gap-y-4 w-auto bg-gradient-to-br from-slate-400
         via-black to-gray-50 shadow-xl '>
            <h1>{`Are you ready to connect with ${selectedUser && selectedUser.nickname.toUpperCase()}?`}</h1>
            <div className='flex'>
            <img 
            className='w-[150px] h-[150px] rounded-full shadow-md'
            src={selectedUser && selectedUser.picture} 
            alt={`${selectedUser && selectedUser.nickname}`}/>
            </div>
            {console.log(formerUsers)}
            <button className='p-3 bg-gradient-to-r from-slate-700 via-stone-600 to-zinc-700 shadow-md rounded-md w-[30%] mx-[70%] flex justify-center items-end'
            onClick={()=>{setSelectedUser(incomingUser); setFormerUsers(incomingUser); closeModal(); setShowValidateUser(false)}}>Yes</button>
            <button className='p-3 bg-gradient-to-r from-slate-700 via-stone-600 to-zinc-700 shadow-md rounded-md w-[30%] mx-[70%] flex justify-center items-end'
            onClick={()=>{ setSelectedUser(formerUsers) ; setShowValidateUser(false);  closeModal();  }}>Cancel</button>
        </div>
        </Modal>
    // </div>
  )
}
