'use client'
import { useState, useTransition } from 'react';
import { FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, addDoc, collection, getDocs, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const router = useRouter()

  const handleSubmit = (e) => {
    e.preventDefault();

    const { email, password } = formData;
    startTransition(async()=>{
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Optionally update the user's profile with their name
            const userdata = {
                userId: userCredential.user.uid,
                nickname: formData && formData.name,
                email: email,
                isOnline: true,
                time: serverTimestamp()
            }
            const usersRef = collection(db, 'users')
            const usersRefsnapshot = await getDocs(usersRef)
            if (usersRefsnapshot){
                await setDoc(doc(db, 'users', userCredential.user.uid), {userdata})
            }
            
           
            
            await updateProfile(userCredential.user, { displayName: formData.name, email:email });
            console.log('User signed up successfully:', userCredential.user);
            router.push('/dashboard')
          } catch (err) {
            setError(err.message);
          }
    })  
  };

  return (
    <div className={`min-h-screen flex justify-center items-center bg-gray-100`}>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">Sign Up</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaUser className="text-gray-400 mr-3" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 outline-none text-gray-600"
              required
            />
          </div>
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaEnvelope className="text-gray-400 mr-3" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 outline-none text-gray-600"
              required
            />
          </div>
          <div className="flex items-center border-b border-gray-300 py-2">
            <FaLock className="text-gray-400 mr-3" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-2 outline-none text-gray-600"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {isPending? <FaSpinner fill='white' size={20} className='animate-spin mx-auto'/> : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
