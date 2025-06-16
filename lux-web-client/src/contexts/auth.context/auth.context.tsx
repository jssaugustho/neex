"use client";

// @types
import { iAuthContext } from "@/@types/auth.context";
import { iSession } from "@/@types/session";

//services
import initApi from "@/services/api";
import getStorage from "@/services/getStorage";
import { error } from "console";

import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext<iAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const api = initApi();

  const [session, setSession] = useState<iSession>({
    signed: false,
    theme: "dark",
  });

  useEffect(() => {
    const storage = getStorage();

    setSession(storage);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const themeListener = (event: MediaQueryListEvent) => {
      if (!sessionStorage.getItem("session@theme"))
        setSession((old) => ({
          ...old,
          theme: event.matches ? "dark" : "light",
        }));
    };

    media.addEventListener("change", themeListener);

    return () => {
      media.removeEventListener("change", themeListener);
    };
  }, []);

  useEffect(() => {
    if (session.theme)
      document.documentElement.setAttribute("data-theme", session.theme);
  }, [session.theme]);

  const initializeSession = (user: iUser, sessionId: string) => {
    sessionStorage.setItem("user@id", user.id);
    sessionStorage.setItem("user@email", user.email);
    sessionStorage.setItem("user@phone", user.email);
    sessionStorage.setItem("user@name", user.name);
    sessionStorage.setItem("user@lastName", user.lastName);
    sessionStorage.setItem("user@emailVerified", String(user.emailVerified));

    setSession((old) => {
      return {
        signed: true,
        sessionId,
        userId: user.id,
        userEmail: user.email,
        userName: user.name,
        userLastName: user.lastName,
        userEmailVerified: user.emailVerified,
        userPhone: user.phone,
        theme: old.theme,
      };
    });
  };

  const endSession = () => {
    sessionStorage.removeItem("user@id");
    sessionStorage.removeItem("user@email");
    sessionStorage.removeItem("user@phone");
    sessionStorage.removeItem("user@name");
    sessionStorage.removeItem("user@lastName");
    sessionStorage.removeItem("user@emailVerified");
    setSession((old) => {
      return {
        signed: false,
        theme: old.theme,
      };
    });
  };

  const changeTheme = () => {
    const newTheme = session.theme === "dark" ? "light" : "dark";
    sessionStorage.setItem("session@theme", newTheme);
    setSession((old) => {
      return {
        ...old,
        theme: newTheme,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{ api, session, initializeSession, endSession, changeTheme }}
    >
      <div className={`${session.theme}-theme background viewport`}>
        {children}
      </div>
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("O contexto deve ser importando dentro do provider.");

  return context as iAuthContext;
}
