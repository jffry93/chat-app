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
import { useEffect } from 'react';

const Chatroom = () => {
  //USER INFORMATION
  const auth = getAuth();
  const [user] = useAuthState(auth);

  const firestore = getFirestore();

  // ADD DATA TO FIRESTORE EXAMPLE
  //SPECIFY THE PATH
  const specialOfTheDay = doc(firestore, 'dailySpecial/2021-09-15');
  async function writeDailySpecial() {
    const docData = {
      description: 'A delicious thing',
      price: 1.0,
      milk: 'none',
      vegan: true,
    };
    await setDoc(specialOfTheDay, docData);
  }

  //ADD A NEW DOCUMENT AND COLLECTION WITHOUT SPECIFYING PATH
  //this method returns a newDoc variable
  const ordersCollection = collection(firestore, 'orders');

  async function addNewDocument() {
    const newDoc = await addDoc(ordersCollection, {
      customer: 'Brian',
      drink: 'milk',
      total_cost: (100 + Math.floor(Math.random() * 400)) / 100,
    });
    // console.log(newDoc.path);
  }

  //Read a single documnent
  async function readSingleDocument() {
    const mySnapshot = await getDoc(specialOfTheDay);

    if (mySnapshot.exists()) {
      const docData = mySnapshot.data();
      // console.log(`My data in string form is ${docData.vegan}`);
    }
  }

  //READ A DOCUMENT IN REAL TIME
  function listenToDocument() {
    onSnapshot(specialOfTheDay, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const docData = docSnapshot.data();
        console.log(
          `In realtime, docData is currently is ${JSON.stringify(docData)}`
        );
      }
    });
  }

  //CALL QUERY TO GET MULTIPLE DOCS
  async function queryforDocuments() {
    const customerOrderQuery = query(
      collection(firestore, 'orders'),
      where('drink', '==', 'milk'),
      // orderBy('total_cost'),
      limit(10)
    );
    const querySnapshot = await getDocs(customerOrderQuery);
    //allDocs = array
    const allDocs = querySnapshot.forEach((snap) => {
      console.log(
        `Document ${snap.id} contains ${JSON.stringify(snap.data())}`
      );
    });
  }

  useEffect(() => {
    listenToDocument();
    writeDailySpecial();
    // addNewDocument();
    readSingleDocument();
    queryforDocuments();
  }, []);

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
