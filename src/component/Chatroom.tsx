import styled from 'styled-components';

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
    orderBy('createdAt', 'desc'),
    limit(20)
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

  // const commentEnterSubmit = (e) => {
  //   if (e.key === "Enter" && e.shiftKey == false) {
  //     console.log('foo');
  //     // const data = {content:e.target.value};
  //     // return handleSubmit(CommentOnSubmit(data));
  //   }
  const commentEnterSubmit = (e) => {
    if (e.key === 'Enter' && e.shiftKey == false) messageHandler(e);
  };

  return (
    <StyledMain>
      <StyledMessage>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {values &&
          values.map((msg, i) => <Message key={i} message={msg} auth={auth} />)}
        <div ref={dummy}></div>
      </StyledMessage>
      <form onSubmit={messageHandler}>
        <textarea
          rows='4'
          value={formValue}
          onChange={(e) => setFormValue(e.target.value)}
          onKeyPress={commentEnterSubmit}
        />
        <button type='submit'>Send</button>
      </form>
    </StyledMain>
  );
};

export default Chatroom;

const StyledMain = styled.div`
  height: var(--container-height);
  width: 100%;
  border: 1px solid red;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  form {
    /* height: 10vh; */
    /* bottom: 0; */
    background-color: rgb(24, 23, 23);
    width: 100%;
    /* max-width: 728px; */
    display: flex;
    font-size: 1.5rem;
  }

  form button {
    width: 20%;
    background-color: rgb(56, 56, 143);
  }

  textarea {
    line-height: 1.5;
    width: 100%;
    height: 100px;
    font-size: clamp(18px, 4vw, 25px);
    background: rgb(58, 58, 58);
    color: white;
    outline: none;
    border: none;
    padding: 8px 16px;
  }
`;
const StyledMessage = styled.div`
  display: flex;
  flex-direction: column-reverse;
  height: 100%;
  border: 1px solid yellow;

  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    background: #1e1e24;
  }

  &::-webkit-scrollbar-thumb {
    background: #6649b8;
  }
`;
