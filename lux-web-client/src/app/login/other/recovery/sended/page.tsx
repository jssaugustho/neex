"use client";

import { Input } from "@/components/input";

import styles from "./sended.module.css";
import Button from "@/components/button";
import { useOther } from "../../other.context";
import { useRecovery } from "@/hooks/useRecovery";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/auth.context";

export default function Sended() {
  const { router } = useAuth();

  const { timeString, email, timeLeft, sended, resetTimeLeft } = useOther();

  useEffect(() => {
    if (!sended) router.push("/login/other/recovery");
  }, [router, sended]);

  const { mutate, isPending, isSuccess, isError, error, data } = useRecovery();

  let disabled = isPending || timeLeft > 0;

  const sendEmail = () => {
    if (email) mutate({ email });
  };

  return (
    <div className={styles.form}>
      <div className={styles.header}>
        <div className={styles.iconBox}>
          <i className="fi fi-br-check"></i>
        </div>
        <h1 className={styles.title}>Email enviado com sucesso.</h1>
        <p className={styles.paragraph}>
          Clique no link que foi enviado para {email} e redefina a sua senha.
        </p>
      </div>
      <div className="buttons">
        <Button
          disabled={disabled}
          type="button"
          onClick={sendEmail}
          background={disabled ? "transparent" : "gradient"}
          className="submit"
        >
          {isPending
            ? "Enviando email..."
            : timeLeft > 0
            ? `${timeString}`
            : "Reenviar Email"}
        </Button>
        <Button
          className="back"
          background={"transparent"}
          type="button"
          onClick={() => resetTimeLeft()}
        >
          Alterar email
        </Button>
      </div>
    </div>
  );
}
