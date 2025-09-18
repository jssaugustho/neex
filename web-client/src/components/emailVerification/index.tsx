"use client";

import { Input } from "@/components/input";

import styles from "./emailVerification.module.css";

import Button from "@/components/button";
import { useSendEmail } from "../../contexts/sendEmail.context";
import React, { useState } from "react";
import { useAppRouter } from "@/contexts/navigation.context";

type emailVerificationProps = {
  title: React.ReactNode | string;
  description: React.ReactNode | string;
  sendedTitle: React.ReactNode | string;
  sendedDescription: React.ReactNode | string;
  input?: React.ReactNode | null;
  isLoading: boolean;
  isSuccess: boolean;
  onSend: () => void;
  sendLabel: string;
  back: () => void;
  backLabel: string;
  message: string | null;
  locked?: boolean;
  reset: () => void;
};

export default function EmailVerification({
  input,
  title,
  description,
  sendedTitle,
  sendedDescription,
  isLoading,
  isSuccess,
  onSend,
  sendLabel,
  back,
  backLabel,
  message,
  locked,
  reset,
}: emailVerificationProps) {
  const {
    email,
    setEmail,
    timeLeft,
    timeString,
    sended,
    resetTimeLeft,
    setSended,
  } = useSendEmail();

  const { push } = useAppRouter();

  let disabled = isLoading || timeLeft > 0;

  const sendEmail = () => {
    if (email) {
      localStorage.setItem("session@email", email);
      setEmail(email);
      onSend();
    }
  };

  const SendStep = (
    <div className={styles.form}>
      <div className={styles.header}>
        {typeof title === "string" ? (
          <h1 className={"title"}>{title}</h1>
        ) : (
          title
        )}
        {typeof description === "string" ? (
          <p className={styles.paragraph}>{description}</p>
        ) : (
          description
        )}
      </div>
      <div className={styles.inputs}>
        {input || (
          <Input
            disabled={locked}
            placeholder="Digite seu email."
            type="email"
            name="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        )}
        {typeof message === "string" && message}
      </div>
      <div className="buttons">
        <Button
          disabled={disabled}
          type="button"
          onClick={sendEmail}
          background={disabled ? "transparent" : "gradient"}
          className="submit"
        >
          {timeLeft > 0
            ? `Aguarde ${timeString} para reenviar`
            : isLoading
            ? "Enviando email..."
            : sendLabel}
        </Button>
        <Button
          disabled={disabled}
          onClick={back}
          className="back"
          background={"transparent"}
          type="button"
        >
          {backLabel}
        </Button>
      </div>
    </div>
  );

  const SendedStep = (
    <div className={styles.form}>
      <div className={styles.header}>
        <div className={styles.iconBox}>
          <i className="fi fi-br-check"></i>
        </div>
        {typeof sendedTitle === "string" ? (
          <h1 className="title">{sendedTitle}</h1>
        ) : (
          sendedTitle
        )}
        {typeof sendedDescription === "string" ? (
          <p className={styles.paragraph}>{sendedDescription}</p>
        ) : (
          sendedDescription
        )}
      </div>
      <div className="buttons">
        <Button
          disabled={disabled}
          type="button"
          onClick={sendEmail}
          background={disabled ? "transparent" : "gradient"}
          className={`submit ${styles.variableButton}`}
        >
          {isLoading
            ? "Verificando..."
            : timeLeft > 0
            ? `Aguarde ${timeString} para reenviar`
            : "Reenviar Email"}
        </Button>
        <Button
          onClick={() => {
            resetTimeLeft();
            setEmail("");
            localStorage.removeItem("session@email");
            reset();
            setSended(false);
          }}
          className="back"
          background={"transparent"}
          type="button"
        >
          Voltar
        </Button>
      </div>
    </div>
  );

  if (isSuccess || sended) return SendedStep;

  return SendStep;
}
