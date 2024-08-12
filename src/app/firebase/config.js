// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY)
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY_CHAT,//"AIzaSyCpObHMspV01GxhoVI15fkx8mCdw9_CR7k",//process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN_CHAT,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID_CHAT,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET_CHAT,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID_CHAT,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID_CHAT,
//   measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, app, db }
