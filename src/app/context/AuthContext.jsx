import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { getProfileById, mapProfileToUser } from "../data/profileStore";

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
    if (!supabase) {
      return undefined;
    }

    let isMounted = true;

    const buildUserProfile = async (authUser) => {
      if (!authUser) {
        return null;
      }

      const storedUser = getStoredUser();
      const profileRow = await getProfileById(authUser.id);

      return mapProfileToUser(authUser, profileRow, storedUser?.profilePicture);
    };

    const applyAuthSession = async (session) => {
      const authUser = session?.user;
      if (!authUser) {
        localStorage.removeItem(USER_KEY);
        setUser(null);
        return;
      }

      const storedUser = getStoredUser();
      const fallbackProfile = mapProfileToUser(authUser, null, storedUser?.profilePicture);
      localStorage.setItem(USER_KEY, JSON.stringify(fallbackProfile));
      setUser(fallbackProfile);

      const profile = await buildUserProfile(authUser);
      if (profile) {
        localStorage.setItem(USER_KEY, JSON.stringify(profile));
        setUser(profile);
      }
    };

    supabase.auth.getSession().then(async ({ data }) => {
      if (!isMounted) {
        return;
      }

      try {
        await applyAuthSession(data.session);
      } catch {
        const authUser = data.session?.user;
        if (!authUser) {
          localStorage.removeItem(USER_KEY);
          setUser(null);
          return;
        }

        const storedUser = getStoredUser();
        const fallbackProfile = mapProfileToUser(authUser, null, storedUser?.profilePicture);
        localStorage.setItem(USER_KEY, JSON.stringify(fallbackProfile));
        setUser(fallbackProfile);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void applyAuthSession(session).catch(() => {
        const authUser = session?.user;
        if (!authUser) {
          localStorage.removeItem(USER_KEY);
          setUser(null);
          return;
        }

        const storedUser = getStoredUser();
        const fallbackProfile = mapProfileToUser(authUser, null, storedUser?.profilePicture);
        localStorage.setItem(USER_KEY, JSON.stringify(fallbackProfile));
        setUser(fallbackProfile);
      });
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
      updateUserProfile(nextUser) {
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
      },
      async logout() {
        localStorage.removeItem(USER_KEY);
        setUser(null);

        if (supabase) {
          try {
            await supabase.auth.signOut();
          } catch {
            // Local session state is already cleared above.
          }
        }
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
