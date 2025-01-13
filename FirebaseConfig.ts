// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, getReactNativePersistence, initializeAuth, updateProfile } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_projectId,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID
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