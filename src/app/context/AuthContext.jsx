import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

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

  useEffect(() => {
    let isMounted = true;

    const buildUserProfile = (authUser) => {
      if (!authUser) {
        return null;
      }

      return {
        id: authUser.id,
        email: authUser.email,
        fullName: authUser.user_metadata?.full_name || authUser.email?.split("@")[0],
        profilePicture: authUser.user_metadata?.profile_picture || null,
      };
    };

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      const profile = buildUserProfile(data.session?.user);
      if (profile) {
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
        setUser(profile);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const profile = buildUserProfile(session?.user);
      if (profile) {
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
        setUser(profile);
      } else {
        localStorage.removeItem(USER_KEY);
        setUser(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login(payload) {
        localStorage.setItem(USER_KEY, JSON.stringify(payload));
        setUser(payload);
      },
      async logout() {
        await supabase.auth.signOut();
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

