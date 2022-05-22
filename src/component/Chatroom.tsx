import { getAuth } from 'firebase/auth';
//FIREBASE AUTH
import { useAuthState } from 'react-firebase-hooks/auth';
//FIREBASE FIRESTORE
import 'firebase/compat/firestore';
import { initializeApp } from 'firebase/app';
import {
  addDoc,
  collection,
  doc,
  DocumentSnapshot,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
  serverTimestamp,
} from 'firebase/firestore';
//REACT FIREBASE HOOKS
import {
  useCollection,
  useCollectionData,
} from 'react-firebase-hooks/firestore';

import { useEffect, useRef, useState } from 'react';
import Message from './Message';

const Chatroom = () => {
  //USER INFORMATION
  const auth = getAuth();
  const [user] = useAuthState(auth);
  //REACT FIREBASE HOOKS
  const messagesRef = collection(getFirestore(), 'messages');
  //STATE
  const [formValue, setFormValue] = useState('');
  const dummy = useRef();
  // console.log(messagesRef);
  // created custom query to populate messages in order created
  const customQuery = query(
    collection(getFirestore(), 'messages'),
    orderBy('createdAt'),
    limit(30)
  );
  // console.log(customQuery);
  const [values, loading, error] = useCollectionData(customQuery, {
    idField: 'id',
  });

  //ADD NEW MESSAGE DOCUMENT TO FIRESTORE COLLECTION
  const messageHandler = async (e) => {
    e.preventDefault();
    const { uid, photoURL } = auth.currentUser;

    await addDoc(messagesRef, {
      message: formValue,
      createdAt: serverTimestamp(),
      uid,
      photoURL,
    });
    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });

    console.log(uid, photoURL);
    console.log(messagesRef);
  };

  return (
    <div>
      <div>
        <h2>Welcome</h2>
        <img src={auth.currentUser?.photoURL} alt='' />
        <h3>{user?.displayName}</h3>
      </div>
      <div>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {values &&
          values.map((msg, i) => <Message key={i} message={msg} auth={auth} />)}
        <div ref={dummy}></div>
      </div>
      <form onSubmit={messageHandler}>
        <input
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
        />
        <button type='submit'>Send</button>
      </form>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
};

export default Chatroom;
