import { getAuth } from 'firebase/auth';
//FIREBASE AUTH
import { useAuthState } from 'react-firebase-hooks/auth';
//FIREBASE FIRESTORE

import 'firebase/compat/firestore';
import { initializeApp } from 'firebase/app';
import { doc, getFirestore, setDoc } from 'firebase/firestore';

const Chatroom = () => {
  const firebaseConfig = initializeApp({
    apiKey: 'AIzaSyAGcfGyFH5--R4Ct86VYVSFqn5nPnV3tqs',
    authDomain: 'encouraging-key-317117.firebaseapp.com',
    projectId: 'encouraging-key-317117',
    storageBucket: 'encouraging-key-317117.appspot.com',
    messagingSenderId: '573617634514',
    appId: '1:573617634514:web:e2ee6572a081c33bf7810b',
    measurementId: 'G-WR1B7K7400',
  });

  const firestore = getFirestore();
  const auth = getAuth();
  const [user] = useAuthState(auth);

  const specialOfTheDay = doc(firestore, 'dailySpecial/2021-09-14');
  function writeDailySpecial() {
    const docData = {
      description: 'A delicious coffee',
      price: 2.0,
      milk: 'none',
      vegan: true,
    };
    setDoc(specialOfTheDay, docData);
  }
  console.log(specialOfTheDay);
  writeDailySpecial();

  return (
    <div>
      <div>
        <h2>Welcome</h2>
        <h3>{user?.displayName}</h3>
      </div>

      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
};

export default Chatroom;
