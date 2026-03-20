import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth =
  Platform.OS === "web"
    ? getAuth(app)
    : (() => {
        try {
          return initializeAuth(app, {
            persistence: getReactNativePersistence(ReactNativeAsyncStorage),
          });
        } catch {
          return getAuth(app);
        }
      })();

let db = null;
let storage = null;

const getDb = () => {
  if (!db) {
    if (Platform.OS === "web") {
      db = getFirestore(app);
    } else {
      try {
        db = initializeFirestore(app, {
          experimentalForceLongPolling: true,
          useFetchStreams: false,
        });
      } catch {
        db = getFirestore(app);
      }
    }
  }
  return db;
};

const getStorageInstance = () => {
  if (!storage) {
    storage = getStorage(app);
  }
  return storage;
};

export { auth, getDb, getStorageInstance as getStorage };
