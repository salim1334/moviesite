// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { addDoc, collection, getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBrSpkfWk-LPJkFZOuZt3ZahREm4RNFlCQ',
  authDomain: 'netflix-clone-d92df.firebaseapp.com',
  projectId: 'netflix-clone-d92df',
  storageBucket: 'netflix-clone-d92df.firebasestorage.app',
  messagingSenderId: '467675091765',
  appId: '1:467675091765:web:2ed742dca8da7a579f727c',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // For login, signup, logout
const db = getFirestore(app); // For saving user data (like name, uid)

const signup = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    await addDoc(collection(db, 'user'), {
      uid: user.uid,
      name,
      authProvider: 'local',
      email,
    });
  } catch (err) {
    console.log(err);
    alert(err);
  }
};

const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.log(err);
    alert(err);
  }
};

const logout = async () => {
  await signOut(auth);
};

export { auth, db, login, signup, logout };
