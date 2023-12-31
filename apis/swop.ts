import { initializeApp } from "firebase/app";
import { collection, doc, getCountFromServer, getDoc, getDocs, getFirestore, limit, onSnapshot, orderBy, query, startAfter, where } from "firebase/firestore";
import { firebaseConfig } from "../packages/firebase-config";
import { Offer } from '../apps/swop/types';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// For Public Offers
let lastPublicVisible: any = null;
export const getPublicOffers = (callback: any) => {
  const q = query(collection(db, 'offers'), where('type', '==', 'Public'), orderBy('createdAt', 'desc'), limit(20));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const results: Offer[] = [];

    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    lastPublicVisible = snapshot.docs[snapshot.docs.length - 1];
    callback(results);
  });

  return unsubscribe;
};

export const getMorePublicOffers = async () => {
  const next = query(collection(db, 'offers'),
    where('type', '==', 'Public'),
    orderBy('createdAt', 'desc'),
    startAfter(lastPublicVisible),
    limit(20));

  const snapshot = await getDocs(next);
  const results: Offer[] = [];

  snapshot.forEach((doc) => {
    results.push({ id: doc.id, ...doc.data() });
  });

  lastPublicVisible = snapshot.docs[snapshot.docs.length - 1];

  return results;
};

export const getPublicOfferCount = async () => {
  try {
    const offerRef = query(collection(db, 'offers'), where('type', '==', 'Public'));
    const snapshot = await getCountFromServer(offerRef);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting document count:', error);
    return 0;
  }
};

// For Private Offers
// export const getPrivateOffers = (accountAddress, callback: any) => {
//   console.log('accountAddress', accountAddress);
//   const q1 = query(collection(db, 'offers'), where('type', '==', 'Private'), where('receiver', '==', accountAddress.toLowerCase()), orderBy('createdAt', 'desc'));
//   const unsubscribe = onSnapshot(q1, (snapshot) => {
//     const results: Offer[] = [];

//     snapshot.forEach((doc) => {
//       results.push({ id: doc.id, ...doc.data() });
//     });

//     callback(results);
//   });

//   return unsubscribe;
// };

export const getCounterOffers = (accountAddress, callback: any) => {
  const q2 = query(collection(db, 'offers'), where('type', '==', 'Private'), where('toDecide', '==', accountAddress.toLowerCase()),
    where('status', '==', 'Pending'), orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q2, (snapshot) => {
    const results: Offer[] = [];

    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    callback(results);
  });

  return unsubscribe;
};

export const getPrivateOfferCount = async (accountAddress) => {
  try {
    const offerRef = query(collection(db, 'offers'), where('type', '==', 'Private'), where('status', '==', 'Pending'), where('receiver', '==', accountAddress));
    const snapshot = await getCountFromServer(offerRef);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting document count:', error);
    return 0;
  }
};

export const getOfferById = async (offerId: string) => {
  const docRef = doc(db, 'offers', offerId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    console.log("No such document!");
  }
};

// Get sent and pending offers
export const getSentOffers = (accountAddress, callback: any) => {
  const q3 = query(collection(db, 'offers'), where('type', '==', 'Private'), where('sender', '==', accountAddress.toLowerCase()), where('status', '==', 'Pending'), orderBy('createdAt', 'desc'));

  const unsubscribe = onSnapshot(q3, (snapshot) => {
    const results: Offer[] = [];

    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    callback(results);
  });

  return unsubscribe;
}
