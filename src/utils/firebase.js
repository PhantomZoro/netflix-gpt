// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJvI_cQIDHuNFFfdDzD_Nk4khEk71ByiY",
  authDomain: "netflixgpt-7ff57.firebaseapp.com",
  projectId: "netflixgpt-7ff57",
  storageBucket: "netflixgpt-7ff57.firebasestorage.app",
  messagingSenderId: "370069574986",
  appId: "1:370069574986:web:f1418e2744ada2df7d5db3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth();