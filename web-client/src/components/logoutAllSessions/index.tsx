import { useState } from "react";
import { Input } from "../input";
import Button from "../button";
import { useRecoveryContext } from "@/contexts/recovery.context";

import styles from "./logutallsessions.module.css";

type ChangePasswdProps = {
  sendLabel: string;
  isLoading: boolean;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  back: () => void;
  backLabel: string;
  errorMessage: string | null;
  mutate: (data: { logout: boolean }) => void;
};

export default function LogoutAllSessions(props: ChangePasswdProps) {
  const handleClick = (logout: boolean) => {
    props.mutate({
      logout,
    });
  };

  return (
    <div className={styles.box}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Gostaria de fazer o logout em todas as sessões?
        </h1>
        <p className={styles.description}>
          Desconecte todos os dispositivos conectados na sua conta, mantendo o
          acesso somente nesse.
        </p>
      </div>
      <div className={styles.inputBox}>
        <Button
          disabled={props.isLoading}
          background="gradient"
          className={`submit`}
          type="submit"
          onClick={() => handleClick(true)}
        >
          Sim
        </Button>

        <Button
          disabled={props.isLoading}
          background="transparent"
          className={`back`}
          type="submit"
          onClick={() => handleClick(false)}
        >
          Não
        </Button>
      </div>
    </div>
  );
}
