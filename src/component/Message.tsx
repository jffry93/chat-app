import { useEffect } from 'react';
import styled from 'styled-components';

const Message = (props: {
  message: { message: any; uid: any; photoURL: any };
  auth: any;
  scrollBottom: any;
}) => {
  const { message, uid, photoURL } = props.message;
  const auth = props.auth;
  const dummy = props.scrollBottom;

  //scroll to bottom of the container when new message is added
  dummy?.current?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest',
  });

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  //   console.log(props.auth);
  return (
    <StyledMessage className={`message ${messageClass}`}>
      <div className='profile'>
        <img src={photoURL} alt='' />
      </div>
      <div className='content'>
        <p>{message}</p>
      </div>
    </StyledMessage>
  );
};

export default Message;

const StyledMessage = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;

  margin-bottom: 12px;

  .profile {
    min-width: 45px;
    display: flex;

    border-radius: 50%;
    overflow: hidden;

    img {
      width: 45px;
    }
  }
  .content {
    display: flex;

    background-color: var(--secondary-shade);
    border: 1px solid white;
    border-radius: 16px;
    border-top-left-radius: 4px;

    text-align: left;
    padding: 24px 16px;
    word-break: break-word;
  }
`;
