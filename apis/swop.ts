import { initializeApp } from "firebase/app";
import { collection, doc, getCountFromServer, getDocs, getFirestore, limit, onSnapshot, orderBy, query, startAfter, updateDoc } from "firebase/firestore";
import { firebaseConfig } from "../packages/firebase-config";
import { Offer } from '../apps/swop/types';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let lastVisible: any = null;
export const getOffers = (callback: any) => {
  const q = query(collection(db, 'offers'), orderBy('createdAt', 'desc'), limit(20));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const results: Offer[] = [];

    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    lastVisible = snapshot.docs[snapshot.docs.length - 1];
    callback(results);
  });

  return unsubscribe;
};

export const getMoreOffers = async () => {
  const next = query(collection(db, 'offers'),
    orderBy('createdAt', 'desc'),
    startAfter(lastVisible),
    limit(20));

  const snapshot = await getDocs(next);
  const results: Offer[] = [];

  snapshot.forEach((doc) => {
    results.push({ id: doc.id, ...doc.data() });
  });

  lastVisible = snapshot.docs[snapshot.docs.length - 1];

  return results;
};

export const getOfferCount = async () => {
  try {
    const offerRef = collection(db, 'offers');
    const snapshot = await getCountFromServer(offerRef);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting document count:', error);
    return 0;
  }
};