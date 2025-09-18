"use client";

import {
  createContext,
  SetStateAction,
  use,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { useAppRouter } from "./navigation.context";

type RecoveryProps = {
  initialized: boolean;
  setInitialized: React.Dispatch<SetStateAction<boolean>>;
  token: string | null;
  setToken: React.Dispatch<SetStateAction<string>>;
  step:
    | "PENDING"
    | "VERIFY_TOKEN"
    | "CHANGE_PASSWD"
    | "LOGOUT_ALL_SESSIONS"
    | "TIMEOUT"
    | "DONE";

  setStep: React.Dispatch<
    SetStateAction<
      | "PENDING"
      | "VERIFY_TOKEN"
      | "CHANGE_PASSWD"
      | "LOGOUT_ALL_SESSIONS"
      | "TIMEOUT"
      | "DONE"
    >
  >;
  timeLeft: number;
  setTimeLeft: React.Dispatch<SetStateAction<number>>;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<SetStateAction<string | null>>;
  email: string | null;
  setEmail: React.Dispatch<SetStateAction<string | null>>;
  passwd: string | null;
  setPasswd: React.Dispatch<SetStateAction<string | null>>;
};

export const Recovery = createContext<RecoveryProps | null>(null);

export const formatMs = (ms: number) => {
  const totalSeconds = Math.floor((ms - 1000) / 1000);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let formatedTime = "";

  if (hours > 0) formatedTime += `${hours}h `;
  if (minutes > 0) formatedTime += `${minutes}m `;
  if (seconds > 0) formatedTime += `${seconds}s`;

  return formatedTime.trim();
};

export const RecoveryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { push } = useAppRouter();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [initialized, setInitialized] = useState(false);
  const [step, setStep] = useState<
    | "PENDING"
    | "VERIFY_TOKEN"
    | "CHANGE_PASSWD"
    | "LOGOUT_ALL_SESSIONS"
    | "TIMEOUT"
    | "DONE"
  >("PENDING");
  const [timeLeft, setTimeLeft] = useState(0);
  const [email, setEmail] = useState<string | null>(null);
  const [passwd, setPasswd] = useState<string | null>(null);

  useLayoutEffect(() => {
    const stepStorage = localStorage.getItem("recovery@step") as
      | "PENDING"
      | "VERIFY_TOKEN"
      | "CHANGE_PASSWD"
      | "LOGOUT_ALL_SESSIONS"
      | "TIMEOUT"
      | "DONE";

    if (stepStorage) {
      setStep(stepStorage);
    } else {
      localStorage.setItem("recovery@step", "VERIFY_TOKEN");
      setStep("VERIFY_TOKEN");
    }
  }, []);

  useEffect(() => {
    if (initialized) {
      if (timeLeft > 1000) {
        const interval = setInterval(() => {
          setTimeLeft((n) => n - 1000);
        }, 1000);

        return () => clearInterval(interval);
      } else {
        setTimeLeft(0);
        setStep("TIMEOUT");
        localStorage.setItem("recovery@step", "TIMEOUT");
      }
    }
  }, [timeLeft]);

  return (
    <Recovery.Provider
      value={{
        token,
        setToken,
        step,
        setStep,
        timeLeft,
        setTimeLeft,
        initialized,
        setInitialized,
        errorMessage,
        setErrorMessage,
        email,
        setEmail,
        passwd,
        setPasswd,
      }}
    >
      {children}
    </Recovery.Provider>
  );
};

export function useRecoveryContext() {
  const context = useContext(Recovery);

  if (!context)
    throw new Error("O contexto deve ser importando dentro do provider.");

  return context as RecoveryProps;
}
