"use client";

import { useParams } from "next/navigation";

import Loader from "@/components/loader/loader";
import { useEffect, useState } from "react";

import { useAppRouter } from "@/contexts/navigation.context";

import VerifyTokenFailed from "@/components/verifyTokenFailed";

import ChangePasswd from "@/components/changePasswd";
import { useRecovery } from "@/hooks/verifyEmailToken/useRecovery";
import { useRecoveryAuthentication } from "@/hooks/useRecoveryAuthentication";

export default function VerifyToken() {
  const { token } = useParams();

  const { mutate, isPending, data } = useRecoveryAuthentication();
  const { startTransition, push } = useAppRouter();

  const [step, setStep] = useState<1 | 2>(1);

  const verify = (passwd: string) => {
    startTransition(() => {
      mutate({ token: token as string, newPasswd: passwd });
    });
  };

  const back = () => {
    localStorage.clear();
    push("/login/other");
  };

  return (
    <ChangePasswd
      isLoading={isPending}
      title="Altere sua senha antiga."
      description="Altere a sua senha antiga para recuperar o acesso à sua conta."
      sendLabel="Redefinir Senha"
      message={data?.message || null}
      back={back}
      backLabel="Voltar"
      verify={verify}
    />
  );
}
