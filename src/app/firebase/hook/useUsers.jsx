'use client'
import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../config';

import { getAuth } from 'firebase/auth';

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useEffect(() => {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('userdata.userId', '!=', currentUser.uid), orderBy('userdata.name'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedUsers = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(fetchedUsers);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return { users };
};

export default useUsers;
