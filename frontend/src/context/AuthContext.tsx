import type { User as FirebaseUser } from "firebase/auth";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  firebaseConfigured,
  signInWithGithubPopup,
  signOutFirebase,
  subscribeToAuth,
} from "@/lib/firebase";

export interface AuthUser {
  uid: string;
  name: string;
  email: string | null;
  /** GitHub handle, lowercased. */
  username: string;
  avatarUrl: string | null;
  provider: "github" | "mock";
}

interface AuthContextValue {
  user: AuthUser | null;
  /** True while the initial auth state is being resolved. */
  isLoading: boolean;
  isAuthenticated: boolean;
  /** True when running on the mock fallback (no Firebase credentials). */
  isMock: boolean;
  signIn: () => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

const MOCK_USER_KEY = "gitgiggles:mock-user";

function mapFirebaseUser(firebaseUser: FirebaseUser): AuthUser {
  const username =
    firebaseUser.displayName?.toLowerCase() ||
    firebaseUser.email?.split("@")[0] ||
    "developer";
  return {
    uid: firebaseUser.uid,
    name: firebaseUser.displayName || username,
    email: firebaseUser.email,
    username,
    avatarUrl: firebaseUser.photoURL,
    provider: "github",
  };
}

function makeMockUser(): AuthUser {
  // A sample developer whose GitHub is riddled with evidence.
  return {
    uid: "mock-alexdev",
    name: "Alex Dev",
    email: "alexdev@example.com",
    username: "alexdev",
    avatarUrl: null,
    provider: "mock",
  };
}

function readMockUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(MOCK_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readMockUser());
  const [isLoading, setIsLoading] = useState(true);
  const isMock = !firebaseConfigured;
  const mockUserRef = useRef<AuthUser | null>(null);

  // Firebase auth state listener (no-op when Firebase is not configured).
  useEffect(() => {
    if (!firebaseConfigured) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const unsubscribe = subscribeToAuth((firebaseUser) => {
      setUser(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (): Promise<AuthUser> => {
    if (firebaseConfigured) {
      const firebaseUser = await signInWithGithubPopup();
      const mapped = mapFirebaseUser(firebaseUser);
      setUser(mapped);
      return mapped;
    }

    // Mock fallback: simulate the GitHub OAuth popup handshake.
    await new Promise((resolve) => setTimeout(resolve, 1100));
    const mockUser = mockUserRef.current ?? makeMockUser();
    mockUserRef.current = mockUser;
    localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
    setUser(mockUser);
    return mockUser;
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    if (firebaseConfigured) {
      await signOutFirebase();
      setUser(null);
      return;
    }
    localStorage.removeItem(MOCK_USER_KEY);
    mockUserRef.current = null;
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      isMock,
      signIn,
      signOut,
    }),
    [user, isLoading, isMock, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
