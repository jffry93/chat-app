import { getAuth } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const Chatroom = () => {
  const auth = getAuth();
  const [user] = useAuthState(auth);
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
