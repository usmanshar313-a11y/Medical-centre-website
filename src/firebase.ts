import { initializeApp, getApps, getApp } from 'firebase/app';
import { initializeFirestore, getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import config from '../firebase-applet-config.json';

const firebaseConfig = {
  apiKey: config.apiKey,
  authDomain: config.authDomain,
  projectId: config.projectId,
  storageBucket: config.storageBucket,
  messagingSenderId: config.messagingSenderId,
  appId: config.appId,
};

const appExists = getApps().length > 0;
const app = appExists ? getApp() : initializeApp(firebaseConfig);

const dbId = config.firestoreDatabaseId || '(default)';

// Initialize Firestore with auto detect long polling for smooth network failover in sandbox environments
export const db = appExists
  ? getFirestore(app, dbId)
  : initializeFirestore(
      app,
      {
        experimentalAutoDetectLongPolling: true,
      },
      dbId
    );

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
