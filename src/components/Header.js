import React, { useEffect } from 'react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { LOGO } from '../utils/constants';

const Header = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(store => store.user)
  const handleSignOutClick = () =>{
    signOut(auth).then(() => {
      
    }).catch((error) => {
      // An error happened
    });
  }

  useEffect(() =>{
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            const {uid, email, displayName, photoURL} = user;
            dispatch(
              addUser({
                uid: uid, 
                email: email, 
                displayName: displayName, 
                photoURL: photoURL
              })
            );
            navigate("/browse")
        } else {
          dispatch(removeUser());
          navigate("/");
        }
      });

      //Unsubscribe will be called when component unmounts
      return ()=>{
        unsubscribe();
      }
  }, []);

  return (
    <div className="absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex justify-between">
        <img 
            src={LOGO}
            alt="logo" 
            className="w-52"
        />
        {user && <div className='flex p-2'>
          <img
          className='w-12 h-12 my-4' 
            alt="user-icon" 
            src= {user?.photoURL}
          />
          <button 
            className='font-bold text-white mx-4'
            onClick={() => handleSignOutClick()}
          >
            Sign Out of Netflix
          </button>
        </div>}
        
    </div>
  )
}

export default Header;