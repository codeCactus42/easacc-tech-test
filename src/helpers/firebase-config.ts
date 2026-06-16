import type { FirebaseOptions } from 'firebase/app';

function readEnv(value: string | undefined) {
  return value && value.trim().length > 0 ? value.trim() : undefined;
}

export const firebaseConfig: FirebaseOptions = {
  apiKey: readEnv(process.env.EXPO_PUBLIC_FIREBASE_API_KEY),
  authDomain: readEnv(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: readEnv(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: readEnv(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: readEnv(
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
  ),
  appId: readEnv(process.env.EXPO_PUBLIC_FIREBASE_APP_ID),
  measurementId: readEnv(process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID),
};

export const missingFirebaseConfigKeys = [
  ['EXPO_PUBLIC_FIREBASE_API_KEY', firebaseConfig.apiKey],
  ['EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', firebaseConfig.authDomain],
  ['EXPO_PUBLIC_FIREBASE_PROJECT_ID', firebaseConfig.projectId],
  ['EXPO_PUBLIC_FIREBASE_APP_ID', firebaseConfig.appId],
]
  .filter(([, value]) => !value)
  .map(([key]) => key);

export const isFirebaseConfigured = missingFirebaseConfigKeys.length === 0;

export const firebaseConfigMessage = isFirebaseConfigured
  ? null
  : `Missing Firebase config: ${missingFirebaseConfigKeys.join(', ')}`;
