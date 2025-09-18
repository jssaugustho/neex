"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";

import { useAppRouter } from "@/contexts/navigation.context";

import { useSendEmail } from "@/contexts/sendEmail.context";

import EmailVerification from "@/components/emailVerification";

import { useSendRecoveryEmail } from "@/hooks/recovery/useSendEmail";

export default function VerifyRecovery() {
  const { startTransition, push } = useAppRouter();

  const { isSuccess, isPending, error, mutate, reset } = useSendRecoveryEmail();

  const { sended, email, setEmail } = useSendEmail();

  const message = error?.response?.data.message || null;

  const returnToLogin = async () => {
    startTransition(async () => {
      localStorage.clear();
      push("/login");
    });
  };

  const sendEmail = () => {
    if (email) {
      startTransition(() => {
        mutate(
          { email },
          {
            onSuccess: () => {
              localStorage.setItem("session@email", email);
            },
          },
        );
      });
    }
  };

  useLayoutEffect(() => {
    const storage = localStorage.getItem("session@email");
    if (storage) {
      setEmail(storage);
      mutate({ email: storage });
    }
  }, []);

  const title = (
    <h1 className="title">
      Envie um link de redefinição de senha no seu email.
    </h1>
  );

  const description = (
    <p className="paragraph">
      Insira o seu email abaixo para receber um link de redefinição de senha.
    </p>
  ); 

  const sendedTitle = <h1 className="title">Link enviado no seu email.</h1>;

  const sendedDescription = (
    <p className="paragraph">
      Enviamos um link de redefinição de senha para o seu email:{" "}
      <span style={{ fontWeight: "600" }}>{email}</span>.
    </p>
  );

  return (
    <EmailVerification
      title={title}
      description={description}
      sendedTitle={sendedTitle}
      sendedDescription={sendedDescription}
      onSend={sendEmail}
      sendLabel={"Enviar link no email"}
      back={returnToLogin}
      backLabel={"Fazer login com email e senha."}
      message={message}
      isLoading={isPending}
      isSuccess={isSuccess}
      locked={sended || isPending}
      reset={reset}
    />
  );
}
