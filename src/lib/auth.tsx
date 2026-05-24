import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface AuthContextValue {
  isAdmin: boolean;
  loading: boolean;
  token: string | null;
  signOut: () => void;
  refreshAuth: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  isAdmin: false,
  loading: true,
  token: null,
  signOut: () => { },
  refreshAuth: () => { },
});

// Custom event for auth changes
const AUTH_CHANGE_EVENT = "auth-change";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const checkAuth = () => {
    const adminToken = localStorage.getItem("adminToken");
    const adminEmail = localStorage.getItem("adminEmail");

    if (adminToken && adminEmail) {
      setToken(adminToken);
      setIsAdmin(true);
    } else {
      setToken(null);
      setIsAdmin(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Initial check
    checkAuth();

    // Listen for custom auth change events
    const handleAuthChange = () => {
      checkAuth();
    };

    window.addEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handleAuthChange);
  }, []);

  const signOut = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminEmail");
    setToken(null);
    setIsAdmin(false);
  };

  const refreshAuth = () => {
    checkAuth();
  };

  return (
    <AuthContext.Provider value={{ isAdmin, loading, token, signOut, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
