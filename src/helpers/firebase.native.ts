import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import type { Auth, Persistence } from 'firebase/auth';
import {
  firebaseConfig,
  firebaseConfigMessage,
  isFirebaseConfigured,
} from './firebase-config';

const { getAuth, initializeAuth } = FirebaseAuth;
const getReactNativePersistence = (
  FirebaseAuth as typeof FirebaseAuth & {
    getReactNativePersistence?: (storage: typeof AsyncStorage) => Persistence;
  }
).getReactNativePersistence;

function createNativeAuth(app: FirebaseApp): Auth {
  try {
    if (!getReactNativePersistence) {
      throw new Error('Firebase React Native persistence is unavailable.');
    }

    return initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    return getAuth(app);
  }
}

const firebaseApp = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = firebaseApp ? createNativeAuth(firebaseApp) : null;
export { firebaseConfigMessage, isFirebaseConfigured };
