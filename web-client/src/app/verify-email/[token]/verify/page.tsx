"use client";

import { useParams } from "next/navigation";

import Loader from "@/components/loader/loader";
import { useEffect, useState } from "react";
import { useVerifyEmail } from "@/hooks/verifyEmailToken/useVerifyEmail";
import { useAppRouter } from "@/contexts/navigation.context";

import VerifyTokenFailed from "@/components/verifyTokenFailed";
import VerifyTokenSuccess from "@/components/verifyTokensuccess";
import { useUser } from "@/hooks/useUser";

export default function VerifyToken() {
  const { token } = useParams();

  const { data: user, isFetching } = useUser();

  const { mutate, isPending } = useVerifyEmail();
  const { startTransition, push } = useAppRouter();

  const [step, setStep] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    if (!user?.emailVerified) {
      startTransition(() => {
        mutate(
          { token: token as string },
          {
            onSuccess: () => {
              setStep(1);
            },
            onError: () => {
              setStep(2);
            },
          },
        );
      });
    }
  }, []);

  if (step === 1 || user?.emailVerified)
    return (
      <VerifyTokenSuccess
        title={"Email Verificado"}
        description={
          "Agora você pode usar todas as funções da sua conta, clique no botão abaixo para cessar a sua dashboard."
        }
        isLoading={isPending}
        redirect={step === 1 ? "/dashboard" : null}
      />
    );

  if (step === 2 && !isFetching)
    return (
      <VerifyTokenFailed
        message="Ops, algo deu errado, reenvie o email e tente novamente."
        title="Erro ao verificar o link."
        isLoading={isPending}
        back={() => {
          push("/verify-email");
        }}
      />
    );

  return <Loader message="Verificando link...." showLogo={false} />;
}
