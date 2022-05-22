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
import LandingPage from './component/LandingPage';

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
  const [toggle, setToggle] = useState(false);
  const [user] = useAuthState(auth);
  console.log(user?.photoURL);

  return (
    <div className='App'>
      <StyledHeader>
        <h2>freeChat</h2>
        {user ? (
          <div className='dropdown'>
            <div
              className='user'
              onClick={() => {
                setToggle(!toggle);
                console.log('foo');
              }}
            >
              <img src={user?.photoURL} alt='' />
            </div>

            <ul className={!toggle ? 'active' : ''}>
              {/* <li>Dark Mode</li> */}
              <li onClick={() => auth.signOut()}>Sign Out</li>
            </ul>
          </div>
        ) : (
          <SignIn setToggle={setToggle} />
        )}
      </StyledHeader>
      {user ? <Chatroom /> : <LandingPage />}
    </div>
  );
}

export default App;

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;

  height: var(--navbar-height);
  width: 100%;
  padding: 0 16px;

  .user {
    display: flex;

    border-radius: 50%;
    width: 33px;
    height: 33px;

    overflow: hidden;
    img {
      width: 33px;
    }
  }
  .dropdown {
    position: relative;

    display: flex;
    ul {
      position: absolute;
      top: 35px;
      right: 0px;
      width: 120px;

      list-style: none;
      text-align: left;
      font-size: clamp(14px, 2vw, 16px);

      background-color: #181b20;

      li {
        padding: 8px 16px;
        border-bottom: 1px solid grey;
      }
    }
    .active {
      display: none;
    }
  }
`;
