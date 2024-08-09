// hooks/useAuth.js
import { useEffect, useState } from 'react';
import { onAuthStateChanged, getAuth } from 'firebase/auth';
import { auth, app } from '@/app/firebase/config';

const useAuth = () => {
  const getUser = getAuth(app)
  const [activeuser, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { activeuser, loading };


};

var newuser = []

export async function getActiveUser(){
  
  const auth = getAuth(app)
  onAuthStateChanged(auth, (currentUser) =>{
    if (currentUser){
      newuser.push(currentUser)}
    else{
      // alert('No user')
      newuser = []
    }//activeuser}
    
  })
  return newuser
  
  
}

export default useAuth;

