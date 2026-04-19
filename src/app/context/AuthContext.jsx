import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);
const USER_KEY = "userProfile";

function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login(payload) {
        localStorage.setItem(USER_KEY, JSON.stringify(payload));
        setUser(payload);
      },
      logout() {
        localStorage.removeItem(USER_KEY);
        setUser(null);
      },
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}

