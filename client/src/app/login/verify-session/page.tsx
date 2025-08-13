"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";

import { useAppRouter } from "@/contexts/navigation.context";

import { useSendEmail } from "@/contexts/sendEmail.context";

import TransitionWrapper from "@/components/transitionWrapper";
import EmailVerification from "@/components/emailVerification";
import { useSendVerifySessionEmail } from "@/hooks/sendEmail/useSendVerifySessionEmail";

export default function VerifySession() {
  const { startTransition, push } = useAppRouter();

  const { isSuccess, isPending, error, mutate } = useSendVerifySessionEmail();

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
      Verifique o seu email para fazer login nesse dispositivo.
    </h1>
  );

  const description = (
    <p className="paragraph">
      Para autorizar o seu login nesse dispositivo você deverá clicar no link
      enviado no seu email.
    </p>
  );

  return (
    <TransitionWrapper motionKey="verify-session">
      <EmailVerification
        title={title}
        description={description}
        sendedTitle="Link enviado no seu email."
        sendedDescription="Clique no link enviado no seu email para autorizar o acesso à sua conta nesse dispositivo."
        onSend={sendEmail}
        sendLabel={"Enviar link no email"}
        back={returnToLogin}
        backLabel="Fazer login em outra conta."
        message={message}
        isLoading={isPending}
        isSuccess={isSuccess}
        locked={sended || isPending}
      />
    </TransitionWrapper>
  );
}
