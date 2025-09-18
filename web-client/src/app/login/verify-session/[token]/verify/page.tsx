"use client";

import { useParams } from "next/navigation";

import Loader from "@/components/loader/loader";
import { useEffect, useState } from "react";
import { useAppRouter } from "@/contexts/navigation.context";

import VerifyTokenFailed from "@/components/verifyTokenFailed";
import { useVerifySession } from "@/hooks/verifyEmailToken/useVerifySession";

export default function VerifyToken() {
  const { token } = useParams();

  const { mutate, isPending } = useVerifySession();
  const { startTransition, push } = useAppRouter();

  const [step, setStep] = useState<0 | 1 | 2>(0);

  useEffect(() => {
    startTransition(() => {
      mutate(
        { token: token as string },
        {
          onError: () => {
            setStep(2);
          },
        },
      );
    });
  }, []);

  if (step === 2)
    return (
      <VerifyTokenFailed
        isLoading={isPending}
        back={() => {
          push("/login/other/verify-session/");
        }}
      />
    );

  return <Loader message="Verificando link...." showLogo={false} />;
}
