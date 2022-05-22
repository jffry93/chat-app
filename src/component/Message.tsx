import React from 'react';

const Message = (props) => {
  const { message, uid, photoURL } = props.message;
  const auth = props.auth;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  //   console.log(props.auth);
  return (
    <div className={`message ${messageClass}`}>
      <img src={photoURL} alt='' />
      <p>{message}</p>
    </div>
  );
};

export default Message;
