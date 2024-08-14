'use client'
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, getDocs } from 'firebase/firestore';
import { app, db } from '../config';

import { getAuth } from 'firebase/auth';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const auth = getAuth(app);
  const currentUser = auth && auth.currentUser;

  useEffect(() => {
    
    
    
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('userdata.userId', '!=', currentUser.uid), orderBy('userdata.name'));

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

    return () => unsubscribe();
  }, [auth]);

  return { users };
};

export default useUsers;
