"use client";

import React, { useEffect, useLayoutEffect, useState } from "react";

import { useAppRouter } from "@/contexts/navigation.context";

import { useSendEmail } from "@/contexts/sendEmail.context";

import TransitionWrapper from "@/components/transitionWrapper";
import EmailVerification from "@/components/emailVerification";

import { useSendRecoveryEmail } from "@/hooks/sendEmail/useSendRecoveryEmail";

export default function VerifyRecovery() {
  const { startTransition, push } = useAppRouter();

  const { isSuccess, isPending, error, mutate } = useSendRecoveryEmail();

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
      Envie um link de recuperação de senha no seu email.
    </h1>
  );

  const description = (
    <p className="paragraph">
      Insira o seu email abaixo para receber um link de redefinição de senha.
    </p>
  );

  return (
    <TransitionWrapper motionKey="recovery">
      <EmailVerification
        title={title}
        description={description}
        sendedTitle="Link enviado no seu email."
        sendedDescription="Clique no link enviado no seu email para fazer login e redefinir a sua senha."
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
