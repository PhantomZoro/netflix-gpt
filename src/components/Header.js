import React, { useEffect } from 'react';
import { auth } from '../utils/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addUser, removeUser } from '../utils/userSlice';
import { LOGO } from '../utils/constants';
import { toggleGptSearchView } from '../utils/gptSlice';
import { SUPPORTED_LANGUAGES } from '../utils/constants';
import { changeLanguage } from '../utils/configSlice';

const Header = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(store => store.user)
  const showGptSearch = useSelector(store => store.gpt.showGptSearch);

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

  const handleGptSearchClick = () =>{
    //Toggle GPT Search
    dispatch(toggleGptSearchView());
  }

  const handleLanguageChange = (e) =>{
    dispatch(changeLanguage(e.target.value));
  }

  return (
    <div className="absolute w-screen px-8 py-2 bg-gradient-to-b from-black z-10 flex justify-between">
        <img 
            src={LOGO}
            alt="logo" 
            className="w-52"
        />
        {user && <div className='flex p-2' onChange={handleLanguageChange}>
          {showGptSearch && <select className='p-2 m-2 bg-gray-900 text-white'>
            {SUPPORTED_LANGUAGES.map((lang) => {
              return <option key={lang.identifier} value={lang.identifier}>{lang.name}</option>
            })}
          </select>}
          <button 
            className='py-2 px-4 mx-4 my-2 bg-purple-500 text-white rounded-lg'
            onClick={handleGptSearchClick}
            >
            {!showGptSearch ? "GPT Search" : "HomePage"}
          </button>
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