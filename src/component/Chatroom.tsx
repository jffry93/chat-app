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
} from 'firebase/firestore';
//REACT FIREBASE HOOKS
import {
  useCollection,
  useCollectionData,
} from 'react-firebase-hooks/firestore';

import { useEffect } from 'react';

const Chatroom = () => {
  //USER INFORMATION
  const auth = getAuth();
  const [user] = useAuthState(auth);

  //REACT FIREBASE HOOKS
  const messagesRef = collection(getFirestore(), 'messages');
  // console.log(messagesRef);
  // created custom query to populate messages in order created
  const customQuery = query(
    collection(getFirestore(), 'messages'),
    orderBy('createdAt'),
    limit(10)
  );
  // console.log(customQuery);
  const [values, loading, error] = useCollectionData(customQuery, {
    idField: 'id',
  });
  console.log(values);

  return (
    <div>
      <div>
        <h2>Welcome</h2>
        <h3>{user?.displayName}</h3>
      </div>
      <div>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {values &&
          values.map((msg) => (
            <div>
              <p>{msg.message}</p>
            </div>
          ))}
      </div>
      <button onClick={() => auth.signOut()}>Sign Out</button>
    </div>
  );
};

export default Chatroom;
