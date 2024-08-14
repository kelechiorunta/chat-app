// pages/login.js
'use client'
import { useContext, useState, useTransition } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { auth, db } from '../firebase/config';
import { FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { authContext } from './AuthComponent';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [loggedIn, setLoggedIn] = useState(false)
  const signedOutContext = useContext(authContext)

  const {isSignedOut, setIsSignedOut} = signedOutContext

  const handleLogin = async (e) => {
    e.preventDefault();
    startTransition(async() => {
        try {
          if (auth){
            await signInWithEmailAndPassword(auth, email, password);
            onAuthStateChanged(auth, async(user) => {
              if (user){
                const userRef = doc(db, 'users', user && user.uid)
                const snapshot = await getDoc(userRef)
                var id = user && user.uid
                  // const unsub = onSnapshot(userRef, async(snapshot) => {
                    if (snapshot.exists()){
                      const { isOnline } = snapshot.data().userdata
                      if (!isOnline){
                        await setDoc(userRef, {userdata:{isOnline:true}}, {merge:true})
                        alert(`${user.displayName||user.email} is now active`)
                      }
                        
                        // return
                      // }  
                    }
                  // })
                  // return () => unsub()
              }
            })
            setLoggedIn(true)
            router.push('/dashboard');
            setIsSignedOut(false)
          }
            
          } catch (error) {
            console.error('Error logging in:', error);
          }
    })
  };

  return (
    <div className={`${loggedIn && 'loggedIn'} flex justify-center items-center w-screen h-max-screen h-screen bg-gray-100`}>
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8 bg-white rounded-lg shadow-md"
      >
        <h2 className="text-2xl mb-6 text-center">Login</h2>
        <div className="mb-4">
          <label className="block mb-2 text-sm font-medium text-gray-600">Email</label>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <FaEnvelope className="w-10 h-10 p-2 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="flex-1 p-2 focus:outline-none"
            />
          </div>
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-medium text-gray-600">Password</label>
          <div className="flex items-center border rounded-lg overflow-hidden">
            <FaLock className="w-10 h-10 p-2 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className={`flex-1 p-2 focus:outline-none`}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
        >
          {isPending? <FaSpinner fill='white' size={20} className='animate-spin mx-auto'/> : 'Login'}
        </button>
        <p className="flex justify-center gap-x-2 text-center mt-4 text-gray-600">
          Don't have an account? <a href="/signup" className="text-indigo-500">Sign up</a>
        </p>
      </form>
      
    </div>
  );
};

export default Login;
