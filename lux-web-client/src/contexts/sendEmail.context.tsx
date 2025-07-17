"use client";

import {
  createContext,
  SetStateAction,
  useContext,
  useLayoutEffect,
  useState,
} from "react";

type SendEmailProps = {
  sended: boolean;
  setSended: React.Dispatch<SetStateAction<boolean>>;
  email?: string;
  setEmail: React.Dispatch<SetStateAction<string>>;
  timeLeft: number;
  setTimeLeft: React.Dispatch<SetStateAction<number>>;
  selected: CardOption;
  setSelected: React.Dispatch<SetStateAction<CardOption>>;
  CardOptions: CardOption[];
  setTimeString: React.Dispatch<SetStateAction<string>>;
  timeString: string;
  resetTimeLeft: () => void;
};

export const SendEmail = createContext<SendEmailProps | null>(null);

export type CardOption = {
  title: string;
  description: string;
  url: string;
};

export const CardOptions: CardOption[] = [
  {
    title: "Autenticar via email.",
    description: "Faça o login clicando em um link enviado no seu email.",
    url: "/login/other/email",
  },
  {
    title: "Esqueci a minha senha.",
    description: "Receba um link de redefinição de senha no seu email.",
    url: "/login/other/recovery",
  },
];

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

export const SendEmailProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [sended, setSended] = useState(false);
  const [email, setEmail] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [selected, setSelected] = useState(CardOptions[0]);
  const [timeString, setTimeString] = useState("");

  useLayoutEffect(() => {
    if (timeLeft >= 1000) {
      const interval = setInterval(() => {
        setTimeLeft((n) => n - 1000);
        setTimeString(formatMs(timeLeft));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [timeLeft]);

  const resetTimeLeft = () => {
    sessionStorage.removeItem("recovery@email");
    sessionStorage.removeItem("verifyEmail@email");
    sessionStorage.removeItem("verifySession@email");
    setSended(false);
    setTimeLeft(0);
    setEmail("");
    setTimeString("");
  };

  return (
    <SendEmail.Provider
      value={{
        resetTimeLeft,
        sended,
        setSended,
        email,
        setEmail,
        timeLeft,
        setTimeLeft,
        selected,
        setSelected,
        CardOptions,
        timeString,
        setTimeString,
      }}
    >
      {children}
    </SendEmail.Provider>
  );
};

export function useSendEmail() {
  const context = useContext(SendEmail);

  if (!context)
    throw new Error("O contexto deve ser importando dentro do provider.");

  return context as SendEmailProps;
}
