import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const SignIn = ({ setToggle }) => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const signIn = () =>
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);

        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        // setUserData(user);
        // ...
        setToggle(false);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  return (
    <section>
      <button onClick={() => signIn()}>Sign in</button>
    </section>
  );
};

export default SignIn;
