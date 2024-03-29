// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, deleteDoc, query, doc, getDocs, where, updateDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
// Your web app's Firebase configuration

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID
} from '@env';

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID
};

// Initialize Firebase
initializeApp(firebaseConfig)

const firestore = getFirestore();
const auth = getAuth();

export {
    firestore,
    collection,
    addDoc,
    deleteDoc,
    query,
    doc,
    getDocs,
    where,
    updateDoc,
    auth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
}