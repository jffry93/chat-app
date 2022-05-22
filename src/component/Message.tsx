import styled from 'styled-components';

const Message = (props) => {
  const { message, uid, photoURL } = props.message;
  const auth = props.auth;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  //   console.log(props.auth);
  return (
    <StyledMessage className={`message ${messageClass}`}>
      <img src={photoURL} alt='' />
      <p>{message}</p>
    </StyledMessage>
  );
};

export default Message;

const StyledMessage = styled.div`
  display: flex;
  align-items: center;
`;
