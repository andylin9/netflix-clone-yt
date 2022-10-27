// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDE9N2S8UEnKIzC-XQUqKKrJQHy2KqQqEg",
  authDomain: "netflix-clone-yt-ee442.firebaseapp.com",
  projectId: "netflix-clone-yt-ee442",
  storageBucket: "netflix-clone-yt-ee442.appspot.com",
  messagingSenderId: "614526456874",
  appId: "1:614526456874:web:afe588c229bb80f4ed5f53"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()
const db = getFirestore()
const auth = getAuth()

export default app
export { auth, db }