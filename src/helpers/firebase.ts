import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  firebaseConfig,
  firebaseConfigMessage,
  isFirebaseConfigured,
} from './firebase-config';

const firebaseApp = isFirebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export { firebaseConfigMessage, isFirebaseConfigured };
