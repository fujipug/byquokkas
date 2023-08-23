import { initializeApp } from "firebase/app";
import { collection, doc, getCountFromServer, getDocs, getFirestore, limit, onSnapshot, orderBy, query, startAfter, updateDoc, where } from "firebase/firestore";
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
export const getPrivateOffers = (callback: any) => {
  const q = query(collection(db, 'offers'), where('type', '==', 'Private'), orderBy('createdAt', 'desc'));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const results: Offer[] = [];

    snapshot.forEach((doc) => {
      results.push({ id: doc.id, ...doc.data() });
    });

    callback(results);
  });

  return unsubscribe;
};

export const getPrivateOfferCount = async () => {
  try {
    const offerRef = query(collection(db, 'offers'), where('type', '==', 'Public'));
    const snapshot = await getCountFromServer(offerRef);
    return snapshot.data().count;
  } catch (error) {
    console.error('Error getting document count:', error);
    return 0;
  }
};