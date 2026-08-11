import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GithubAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type Auth,
  type User as FirebaseUser,
} from "firebase/auth";

/**
 * Firebase configuration — the app degrades gracefully to a mock GitHub
 * sign-in when these env vars are not set, so the frontend works today and
 * real Firebase credentials can be dropped in later via the project's
 * Keys/API keys tab (no code changes required).
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId,
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function ensureFirebase(): Auth {
  if (!firebaseConfigured) {
    throw new Error(
      "Firebase is not configured. Add VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN and VITE_FIREBASE_PROJECT_ID to enable GitHub OAuth.",
    );
  }
  if (!app) {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  }
  return auth!;
}

/**
 * GitHub OAuth provider — the only sign-in method in the product.
 * Minimal read-only scopes: profile name/avatar + email (if public).
 */
export const githubProvider = new GithubAuthProvider();
githubProvider.addScope("read:user");
githubProvider.addScope("user:email");

/** Sign in via the Firebase GitHub popup. Returns the Firebase user. */
export async function signInWithGithubPopup(): Promise<FirebaseUser> {
  const authInstance = ensureFirebase();
  const result = await signInWithPopup(authInstance, githubProvider);
  return result.user;
}

export async function signOutFirebase(): Promise<void> {
  if (!auth) return;
  await firebaseSignOut(auth);
}

/** Subscribe to Firebase auth state. Returns an unsubscribe function. */
export function subscribeToAuth(
  callback: (user: FirebaseUser | null) => void,
): () => void {
  if (!firebaseConfigured) return () => {};
  return onAuthStateChanged(ensureFirebase(), callback);
}
