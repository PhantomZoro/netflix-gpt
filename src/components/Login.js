import React, { useRef } from 'react';
import Header from './Header';
import { useState } from 'react';
import { checkValidData } from '../utils/validate';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../utils/firebase';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { LOGIN_BACKGROUND_IMAGE, USER_AVATAR } from '../utils/constants';

const Login = () => {

    const [isSignInForm, setIsSignInForm] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const dispatch = useDispatch();

    const name = useRef(null);
    const email = useRef(null);
    const password = useRef(null);

    const handleButtonClick = () =>{
        //Validate the form data
        const message = checkValidData(
            email.current.value, 
            password.current.value, 
            !isSignInForm ? name.current?.value : null);
        setErrorMessage(message);

        if(message) return; //Then no need to do Sign In / Sign Up

        if(message === null){
            //Sign In or Sign up
            if(!isSignInForm){
                //Sign Up Logic
                createUserWithEmailAndPassword(auth, email.current.value, password.current.value)
                    .then((userCredential) => {
                        // Signed up 
                        const user = userCredential.user;

                        updateProfile(user, {
                            displayName: name.current.value, 
                            photoURL: USER_AVATAR
                          }).then(() => {
                            //Update the store with display name and photo URL too 
                            const {uid, email, displayName, photoURL} = auth.currentUser;
                            dispatch(
                                addUser({
                                    uid: uid, 
                                    email: email, 
                                    displayName: displayName, 
                                    photoURL: photoURL
                                })
                            );
                          }).catch((error) => {
                            setErrorMessage(error.message)
                        });

                        
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        setErrorMessage(errorCode+errorMessage);
                    });
            }
            else {
                //Sign In Logic
                signInWithEmailAndPassword(auth, email.current.value, password.current.value)
                    .then((userCredential) => {
                        // Signed in 
                        const user = userCredential.user;
                    })
                    .catch((error) => {
                        const errorCode = error.code;
                        const errorMessage = error.message;
                        setErrorMessage(errorCode + errorMessage);
                    });
            }
        }
    }

    const toggleSignInForm = () =>{
        setIsSignInForm(!isSignInForm);
    }

  return (
    
    <div className="relative h-screen">
        <Header/>

        <div className="absolute inset-0">
            <img 
                src={LOGIN_BACKGROUND_IMAGE}
                alt="logo"
                className='h-full w-full object-cover'
            />
        </div>

        <form onSubmit = {(e) => e.preventDefault() }
            className = "w-3/12 absolute p-12 bg-black my-36 mx-auto right-0 left-0 text-white bg-opacity-80">
            <h1 
                className='font-bold text-3xl py-4'>
                {isSignInForm ? "Sign In" : "Sign Up"}
            </h1>
            {!isSignInForm && (<input 
                ref={name}
                type="text" 
                placeholder='Full Name' 
                className="p-4 my-2 w-full bg-gray-600 rounded-lg"
            />)}
            <input 
                ref={email}
                type="text" 
                placeholder='Email Address' 
                className="p-4 my-2 w-full bg-gray-600 rounded-lg"
            />
            <input 
                ref={password}
                type="password" 
                placeholder='Password' 
                className='p-4 my-2 w-full bg-gray-600 rounded-lg'
            />
            <p className='text-red-500 font-bold text-lg py-2'>{errorMessage}</p>
            <button 
                className="p-4 my-4 bg-red-700 w-full rounded-lg"
                onClick = {handleButtonClick}
            >
                {isSignInForm ? "Sign In" : "Sign Up"}                
            </button>
            <p 
                className='py-4 my-4 underline cursor-pointer' 
                onClick={toggleSignInForm}> 
                {isSignInForm ? 
                    "New to Netflix? Sign Up Now ": 
                    "Already Registered? Sign In Now"
                } 
            </p>
        </form>
        
    </div>
  )
}

export default Login