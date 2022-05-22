import styled from 'styled-components';
import './App.css';
import { useState, useEffect } from 'react';
//FIREBASE
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
// import { useCollectionData } from 'react-firebase-hooks/firestore';
// COMPONENTS
import SignIn from './component/SignIn';
import Chatroom from './component/Chatroom';

const firebaseConfig = {
  apiKey: 'AIzaSyAGcfGyFH5--R4Ct86VYVSFqn5nPnV3tqs',
  authDomain: 'encouraging-key-317117.firebaseapp.com',
  projectId: 'encouraging-key-317117',
  storageBucket: 'encouraging-key-317117.appspot.com',
  messagingSenderId: '573617634514',
  appId: '1:573617634514:web:e2ee6572a081c33bf7810b',
  measurementId: 'G-WR1B7K7400',
};
const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const auth = getAuth();

function App() {
  const [user] = useAuthState(auth);
  console.log(user?.photoURL);

  return (
    <div className='App'>
      <StyledHeader>
        <h2>Secret Chat</h2>
        <div className='user'>
          <img src={user?.photoURL} alt='' />
        </div>
      </StyledHeader>
      {user ? <Chatroom /> : <SignIn />}
      {user ? <button onClick={() => auth.signOut()}>Sign Out</button> : ''}
    </div>
  );
}

export default App;

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: var(--navbar-height);
  /* max-width: 600px; */
  /* border: 1px solid red; */
  padding: 0 16px;
  .user {
    display: flex;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 30px;
    }
  }
`;
