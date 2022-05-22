import styled from 'styled-components';
//ICONS
import { GrSend } from 'react-icons/gr';
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
  //REF
  const scrollBottom = useRef<null | HTMLDivElement>(null);

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
    //reset textarea height
    e.target.style.cssText = 'height:50px; ';
  };

  const commentEnterSubmit = (e) => {
    if (e.key === 'Enter' && e.shiftKey == false) messageHandler(e);
  };
  const autosize = (e) => {
    var el = e.target;
    el.style.cssText = 'height:50px; ';
    el.style.cssText = 'height:' + el.scrollHeight + 'px';
  };

  return (
    <StyledMain>
      <StyledMessages>
        <div ref={scrollBottom}></div>
        {error && <strong>Error: {JSON.stringify(error)}</strong>}
        {loading && <span>Collection: Loading...</span>}
        {values &&
          values.map((msg, i) => (
            <Message
              key={i}
              message={msg}
              auth={auth}
              scrollBottom={scrollBottom}
              query={customQuery}
            />
          ))}
      </StyledMessages>
      <form onSubmit={messageHandler}>
        <div className='grow-wrap'>
          <textarea
            rows={1}
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            onKeyPress={commentEnterSubmit}
            onKeyDown={autosize}
          />
        </div>
        <button type='submit'>
          <GrSend size={30} />
        </button>
      </form>
    </StyledMain>
  );
};

export default Chatroom;

const StyledMain = styled.div`
  height: var(--container-height);
  width: 100%;

  display: flex;
  flex-direction: column;
  form {
    display: flex;
    align-items: center;
    gap: 16px;

    background-color: rgb(56, 56, 143);
    padding: 8px 16px;
  }

  form button {
    padding: 11px;
    background-color: rgb(56, 56, 143);
    border: 1px solid white;

    border-radius: 50%;
    height: 50px;
    width: 50px;

    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      position: relative;
      right: 2px;
    }
  }

  .grow-wrap {
    width: 100%;
    display: flex;
    align-items: center;
  }

  textarea {
    line-height: 1.5;
    width: 100%;
    resize: none;
    /* font-size: clamp(18px, 4vw, 25px); */
    font-size: 18px;
    background: rgb(58, 58, 58);
    color: white;
    border: none;
    outline: none;

    border-radius: 30px;
    padding: 10px 24px 10px;
    max-height: 100px;
    min-height: 50px;
  }
`;
const StyledMessages = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 32px;
  padding: 0 16px;

  height: 100%;
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
  .sent {
    flex-direction: row-reverse;
    align-self: flex-end;
    .content {
      border-top-right-radius: 4px;
      border-top-left-radius: 8px;
    }
  }
`;
