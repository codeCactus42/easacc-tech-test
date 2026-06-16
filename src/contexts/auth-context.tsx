import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithCredential,
  signOut,
  type User,
} from 'firebase/auth';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  firebaseAuth,
  firebaseConfigMessage,
  isFirebaseConfigured,
} from '../helpers/firebase';

interface AuthContextValue {
  isLoggedIn: boolean;
  isLoading: boolean;
  isAuthConfigured: boolean;
  configurationMessage: string | null;
  user: User | null;
  userName: string;
  continueAsGuest: () => void;
  loginWithGoogle: (tokens: {
    idToken?: string;
    accessToken?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [isLoading, setIsLoading] = useState(() => Boolean(firebaseAuth));

  useEffect(() => {
    if (!firebaseAuth) {
      return;
    }

    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser);
      if (nextUser) {
        setIsGuest(false);
      }
      setIsLoading(false);
    });
  }, []);

  const requireAuth = useCallback(() => {
    if (!firebaseAuth) {
      throw new Error(firebaseConfigMessage ?? 'Firebase is not configured.');
    }

    return firebaseAuth;
  }, []);

  const loginWithGoogle = useCallback(
    async ({
      idToken,
      accessToken,
    }: {
      idToken?: string;
      accessToken?: string;
    }) => {
      const auth = requireAuth();

      if (!idToken && !accessToken) {
        throw new Error('Google did not return an auth token.');
      }

      const credential = GoogleAuthProvider.credential(
        idToken ?? null,
        accessToken
      );

      await signInWithCredential(auth, credential);
    },
    [requireAuth]
  );

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
  }, []);

  const logout = useCallback(async () => {
    setIsGuest(false);

    if (!firebaseAuth) {
      setUser(null);
      return;
    }

    await signOut(firebaseAuth);
  }, []);

  const userName = useMemo(() => {
    return (
      user?.displayName ??
      user?.email?.split('@')[0] ??
      user?.phoneNumber ??
      (isGuest ? 'Guest' : undefined) ??
      'there'
    );
  }, [isGuest, user]);

  const value = useMemo(
    () => ({
      isLoggedIn: Boolean(user) || isGuest,
      isLoading,
      isAuthConfigured: isFirebaseConfigured,
      configurationMessage: firebaseConfigMessage,
      user,
      userName,
      continueAsGuest,
      loginWithGoogle,
      logout,
    }),
    [
      continueAsGuest,
      isGuest,
      isLoading,
      loginWithGoogle,
      logout,
      user,
      userName,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
