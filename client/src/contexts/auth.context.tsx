"use client";

// @types
import { iAuthContext } from "@/@types/auth.context";
import { iSession } from "@/@types/session";
import Loader from "@/components/loader/loader";

import { useUser } from "@/hooks/useUser";
import initApi from "@/services/api";

import getStorage from "@/services/getStorage";

import { createContext, useState, useContext, useLayoutEffect } from "react";
import { useAppRouter } from "./navigation.context";

export const AuthContext = createContext<iAuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<iSession>({
    signed: false,
    theme: "dark",
  });

  const endSession = () => {
    localStorage.removeItem("session@emailVerified");
    localStorage.removeItem("session@remember");
    localStorage.removeItem("session@signed");
    localStorage.removeItem("session@email");
    setSession((old) => {
      return {
        signed: false,
        empty: true,
        theme: old.theme,
      };
    });
  };

  const api = initApi(endSession);

  useLayoutEffect(() => {
    const storage = getStorage();

    setSession(storage);
  }, []);

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const themeListener = (event: MediaQueryListEvent) => {
      if (!localStorage.getItem("session@theme"))
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

  useLayoutEffect(() => {
    if (session.theme)
      document.documentElement.setAttribute("data-theme", session.theme);
  }, [session.theme]);

  const preAuth = (token: string) => {
    endSession();
    setSession((old) => {
      return {
        ...old,
        token,
      };
    });
  };

  const initializeSession = (user: iUser, remember: boolean) => {
    localStorage.setItem("session@email", user.email);
    localStorage.setItem("session@emailVerified", String(user.emailVerified));
    localStorage.setItem("session@remember", String(remember));
    localStorage.setItem("session@signed", "true");

    setSession((old) => {
      return {
        signed: true,
        empty: false,
        remember,
        emailVerified: user.emailVerified,
        theme: old.theme,
      };
    });
  };

  const changeTheme = () => {
    const newTheme = session.theme === "dark" ? "light" : "dark";
    localStorage.setItem("session@theme", newTheme);
    setSession((old) => {
      return {
        ...old,
        theme: newTheme,
      };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        api,
        session,
        preAuth,
        initializeSession,
        endSession,
        changeTheme,
      }}
    >
      <div className={`${session.theme}-theme background viewport`}>
        {children}
      </div>
    </AuthContext.Provider>
  );
};

export const AuthGuard = ({
  children,
  checkEmailVerification = true,
}: {
  children: React.ReactNode;
  checkEmailVerification?: boolean;
}) => {
  const { session } = useAuth();
  const { push, router } = useAppRouter();

  const { isSuccess, isPending, data: user } = useUser();

  useLayoutEffect(() => {
    if (!getStorage().signed) push("/login");

    if (isSuccess && !user?.emailVerified && checkEmailVerification)
      push("/verify-email");
  }, [router, session.signed, user]);

  if (isPending || !isSuccess) return <Loader showLogo={true} />;

  return <div>{children}</div>;
};

export const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  const { push, router } = useAppRouter();

  useLayoutEffect(() => {
    if (session.signed) push("/dashboard");
  }, [session.signed, router]);

  return <div>{children}</div>;
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context)
    throw new Error("O contexto deve ser importando dentro do provider.");

  return context as iAuthContext;
}
