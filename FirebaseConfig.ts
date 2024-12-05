// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, getReactNativePersistence, initializeAuth, updateProfile } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_projectId, 
  FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID} from "@env";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_projectId,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});

export const UpdateDisplayName = async (displayName: string) => {
  console.log(`Updating displayName to: ${displayName}`);
  if (!displayName || FIREBASE_AUTH.currentUser == null) {
    console.log(`[Error/UpdateDisplayName] Displayname = ${displayName}, currentUser = ${FIREBASE_AUTH.currentUser}`);
    return;
  }

  try {
    await updateProfile(FIREBASE_AUTH.currentUser, { displayName: displayName });
    console.log(`[INFO/UpdateDisplayName] Updated displayName to: ${displayName}`);
  } catch (error: any) {
    console.log(error);
  }
};

// Opcjonalnie: inicjalizacja Analytics
isSupported().then((supported) => {
  if (supported) {
    const analytics = getAnalytics(FIREBASE_APP);
    console.log('Firebase Analytics initialized.');
  } else {
    console.warn('Firebase Analytics is not supported in this environment.');
  }
});