// components/Profile.js
'use client'
import { doc, getDoc, updateDoc, setDoc, getDocFromCache } from 'firebase/firestore';
import { useTransition, useEffect, useState, useCallback, memo, useRef, useContext } from 'react';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaPhone, FaTransgender, FaImage, FaSpinner } from 'react-icons/fa';
import { db } from '../firebase/config';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { authContext } from './AuthComponent';
import Skeleton from 'react-loading-skeleton';
// import useAuth from '@/custom_hooks/useAuth';
const Profile = ({signedInUser, activetab}) => {
  const [isPending, startTransition] = useTransition()
  const [isPendingUploadPic, startTransitionUploadPic] = useTransition()
  const [isPendingUserLoad, startTransitionUserLoad] = useTransition()

  const [isCached, setIsCached] = useState(false)

  const fetchContext = useContext(authContext)

  const {isFetched, setIsFetched} = fetchContext

  const [profile, setProfile] = useState({
    name: '',
    nickname: '',
    // email: '',
    address: '',
    phone: '',
    gender: '',
    picture: null,
  });
  const [photoURL, setPhotoURL] = useState(null)
  const hasFetchedData = useRef(false)

  const getcurrentUserData = useCallback(async() => {
    // startTransitionUserLoad(async() => {
      try{
        if (signedInUser) {
          const userRef = doc(db, 'users', signedInUser.uid)
          const snapshot = await getDoc(userRef)
          if (snapshot.exists()){
            const data = snapshot.data()
            const {name, nickname, address, phone, gender, picture} = data.userdata
            setProfile({
              ...profile,  
              name,
              nickname,
              address,
              phone,
              gender,
              picture: picture || signedInUser.photoURL
              });   
          }  
        }
        setIsFetched(true)
        setIsCached(true)
        hasFetchedData.current=true
      }
      catch(err){
        console.error(err.message, 'Unable to fetch User Data')
      }
      // finally{
        
      // }
    // })
  }, [signedInUser, isCached])

  
    const getUser = useCallback(async() => {
      try{
        if (signedInUser) {
          const userRef = doc(db, 'users', signedInUser.uid)
          const snapshot = await getDocFromCache(userRef)
          if (snapshot.exists()){
            const data = snapshot.data()
            const {name, nickname, address, phone, gender, picture} = data.userdata
            setProfile({
              ...profile,  
              name,
              nickname,
              address,
              phone,
              gender,
              picture: picture || signedInUser.photoURL
              });   
          }  
        }
      }
      catch(err){
        console.error(err.message, 'Unable to fetch User Data')
      }
    })
  
  
  
  useEffect(() => {
    console.log(profile)
      if (!isCached){
        getcurrentUserData()
      }else{
        getUser()   
      }
         
  }, [getcurrentUserData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePictureChange = (e) => {
    startTransitionUploadPic(async() => {
      const file = e.target.files[0];
      try{
        if (file) {
          const storage = getStorage();
          const storageRef = ref(storage, `profilePictures/${file.name}`);
          await uploadBytes(storageRef, file);
          const downloadURL = await getDownloadURL(storageRef);
          // setProfile({ ...profile, picture: e.target.files[0] });
          setPhotoURL(downloadURL)
          setProfile({ ...profile, picture: (downloadURL)  });
      }        
      }
      catch(err){
        console.error(err.message, 'Unable to save Picture')
      }
    })
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    startTransition(async()=>{
        try{
          const signedInUserRef = doc(db, 'users', signedInUser.uid)
          const snapshot = await getDoc(signedInUserRef)
          if (snapshot.exists()){
            const { name, nickname, address, phone, gender, picture } = profile
            await updateProfile(signedInUser, {photoURL:photoURL && photoURL})
            await setDoc(signedInUserRef, {userdata: {name, nickname, address, phone, gender, picture}}, {merge: true} )
           
            alert('Profile updated successfully')
          }
        }
        catch(err){
          console.error(err.message, 'Unable to update message')
        }
    })
    // Handle form submission
    console.log(profile);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start p-4 lg:p-8 bg-gray-100 max-h-screen">
      
      {/* {isPendingUserLoad ? (
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-4 ">
            <Skeleton circle={true} height={50} width={50} />
            <div>
              <Skeleton width={'100%'} />
              <Skeleton width={'100%'} />
            </div>
          </div>
          <Skeleton count={3} />
        </div>
      ) : */}
      
      
      <div className="flex flex-col items-center lg:w-1/3 mb-6 lg:mb-0 lg:mr-8">
        <div className="bg-white p-4 rounded-lg shadow-lg w-full">
          <div className="flex flex-col items-center">
            {profile.picture ? (
              <img
                // src={URL.createObjectURL(profile.picture)}
                src={profile.picture||URL.createObjectURL(profile.picture) }
                alt="Profile"
                className="w-40 h-40 rounded-full object-cover mb-4"
              />
            ) : (
              <FaImage className="w-40 h-40 text-gray-300 mb-4" />
            )}
            <label className="w-full">
            {isPendingUploadPic? 
            <FaSpinner fill='white' size={20} className='mx-auto animate-spin'/> :
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handlePictureChange}
              />
            }
              <div className="text-center cursor-pointer text-blue-500 hover:text-blue-600">
                : Upload Picture
              </div>
            </label>
          </div>
        </div>
      </div>
      
      {/* )} */}
      <div className="lg:w-2/3 w-full">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg space-y-4">
          <div className="flex items-center">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <FaUser className="text-gray-500 mr-2" />
            <input
              type="text"
              name="nickname"
              value={profile.nickname}
              onChange={handleChange}
              placeholder="Nickname"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          {/* <div className="flex items-center">
            <FaEnvelope className="text-gray-500 mr-2" />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div> */}
          <div className="flex items-center">
            <FaMapMarkerAlt className="text-gray-500 mr-2" />
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              placeholder="Address"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <FaPhone className="text-gray-500 mr-2" />
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Phone Number"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex items-center">
            <FaTransgender className="text-gray-500 mr-2" />
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isPending? <FaSpinner fill='white' size={20} className='animate-spin mx-auto'/>:'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default memo(Profile);
