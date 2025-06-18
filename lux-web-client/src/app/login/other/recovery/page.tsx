"use client";

import { Input } from "@/components/input";

import styles from "./recovery.module.css";
import Button from "@/components/button";
import { useOther } from "../other.context";
import { useRecovery } from "@/hooks/useRecovery";
import React, { useEffect } from "react";
import { useAuth } from "@/contexts/auth.context";

export default function Recovery() {
  const { router } = useAuth();

  const { email, setEmail, timeLeft, sended } = useOther();

  const { mutate, isPending, isSuccess, isError, error, data } = useRecovery();

  let disabled = isPending || timeLeft > 0;

  const getMessage = () => {
    // if (isSuccess) {
    //   return <div className={styles.successMessage}>{data.message}</div>;
    // }

    let msg = "Erro interno.";

    if (isError) {
      if (
        (error.response?.data.status === "UserError" ||
          error.response?.data.status === "AuthError") &&
        !sended
      ) {
        msg = error.response?.data.message;
        return <div className={styles.errorMessage}>{msg}</div>;
      }
    }

    return null;
  };

  const sendEmail = () => {
    if (email) mutate({ email });
  };

  useEffect(() => {
    if (sended) router.push("/login/other/recovery/sended");
  }, [router, sended]);

  return (
    <div className={styles.form}>
      <div className={styles.header}>
        <h1 className={styles.title}>Recupere a sua senha</h1>
        <p className={styles.paragraph}>
          Envie um link de redefinição de senha para o seu email para recuperar
          seu acesso.
        </p>
      </div>
      <div className={styles.inputs}>
        <Input
          placeholder="Digite seu email."
          type="email"
          name="email"
          label="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        {getMessage()}
      </div>
      <div className="buttons">
        <Button
          disabled={disabled}
          type="button"
          onClick={sendEmail}
          background={disabled ? "transparent" : "gradient"}
          className="submit"
        >
          {isPending || timeLeft > 0
            ? "Enviando email..."
            : "Enviar Link no Email"}
        </Button>
        <Button
          href={"/login/other"}
          className="back"
          background={"transparent"}
          type="button"
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}
