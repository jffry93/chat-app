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
    // idField: 'id',
  });

  //ADD NEW MESSAGE DOCUMENT TO FIRESTORE COLLECTION
  const messageHandler = async (e: any) => {
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

  const commentEnterSubmit = (e: any) => {
    if (e.key === 'Enter' && e.shiftKey == false) messageHandler(e);
  };
  const autosize = (e: any) => {
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

    background-color: var(--primary-shade);
    padding: 8px 16px;
  }

  form button {
    padding: 11px;
    background-color: var(--primary-color);
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
      filter: brightness(0) saturate(100%) invert(100%) sepia(1%)
        saturate(3284%) hue-rotate(153deg) brightness(100%) contrast(97%);
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
    color: var(--primary-text-color);
    background: var(--secondary-shade);
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
  padding: 0 16px;
  color: var(--primary-text-color);

  height: 100%;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0.25rem;
  }

  &::-webkit-scrollbar-track {
    background: var(--primary-color);
  }

  &::-webkit-scrollbar-thumb {
    background: #6649b8;
  }
  .sent {
    flex-direction: row-reverse;
    align-self: flex-end;
    margin-bottom: 16px;
    border-radius: 16px;

    .profile {
      display: none;
    }
    .content {
      border-top-right-radius: 2px;
      border-top-left-radius: 16px;
      background-color: var(--secondary-color);
      color: white;
      border: 1px solid var(--secondary-color);

      box-shadow: rgba(0, 0, 0, 0.1) 0px 10px 15px -3px,
        rgba(0, 0, 0, 0.05) 0px 4px 6px -2px;
    }
  }
`;
